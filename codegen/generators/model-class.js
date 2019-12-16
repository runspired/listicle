const writeFile = require('../utils/write-file');

function getRelatedType(propertyName) {
  switch (propertyName) {
    case "item":
    case "items":
      return "item";
    case "facets":
      return "facet";
    case "list":
    case "lists":
      return "list";
    case 'author':
      return 'author';
    default:
      return "facet";
  }
}


module.exports = function generateModel(schema, KlassName) {
  let attrs = Object.keys(schema.attributes).map(attr => {
    return `@attr ${attr};`;
  });
  let rels = Object.keys(schema.relationships);
  let imports = [];

  if (attrs.length) {
    imports.push("attr");
  }
  let has_belongsTo = false;
  let has_hasMany = false;
  let extendsFacet = schema.type.startsWith("facet") && schema.type !== "facet";
  let rDefs = [];
  rels.forEach(r => {
    if (!Array.isArray(schema.relationships[r].data)) {
      if (!extendsFacet || r !== "item") {
        has_belongsTo = true;
        rDefs.push(
          `@belongsTo('${getRelatedType(r)}', { inverse: '${
            schema.type
          }s', async: true, polymorphic: ${r.startsWith("facet")} })\n  ${r};`
        );
      }
    } else {
      has_hasMany = true;
      rDefs.push(
        `@hasMany('${getRelatedType(r)}', { inverse: '${
          schema.type
        }', async: true, polymorphic: ${r.startsWith("facet")} })\n  ${r};`
      );
    }
  });
  if (has_belongsTo) {
    imports.push("belongsTo");
  }
  if (has_hasMany) {
    imports.push("hasMany");
  }
  let ExtendedKlass = extendsFacet ? "Facet" : "Model";

  let lines = [
    `import ${extendsFacet ? "" : "Model, "}{ ${imports.join(
      ", "
    )} } from '@ember-data/model';`,
    `${extendsFacet ? "import Facet from './facet';\n" : ""}`,
    `export default class ${KlassName} extends ${ExtendedKlass} {`,
    `  ${attrs.join("\n  ")}`,
    `  ${rDefs.join("\n  ")}`,
    "}"
  ];
  let Model = lines.join("\n");

  writeFile(`./app/models/${schema.type}.js`, Model, false);
}

const writeFile = require('../utils/write-file');

module.exports = function generateSerializer(type, KlassName) {
  let Serializer = `import JSONAPISerializer from "@ember-data/serializer/json-api";

export default class ${KlassName}Serializer extends JSONAPISerializer {
  keyForAttribute(key) { return key; }
}
`;
  writeFile(`./app/serializers/${type}.js`, Serializer, false);
}

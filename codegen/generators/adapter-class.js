const writeFile = require('../utils/write-file');

module.exports = function generateAdapter(type, KlassName) {
  let Adapter = `import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class ${KlassName}Adapter extends JSONAPIAdapter {
  urlForFindRecord(id, type) {
    return \`./fixtures/\${type}_\${id}.json\`;
  }
}
`;
  writeFile(`./app/adapters/${type}.js`, Adapter, false);
}

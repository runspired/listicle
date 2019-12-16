const config = require('./config');
const baseSchemas = require('./utils/base-schemas');
const generateClassesForSchema = require('./utils/classes-for-schema');
const makeItemsForList = require('./utils/make-items-for-list');
const generateListFixture = require('./generators/list-fixture');
const writeFile = require('./utils/write-file');

generateClassesForSchema(baseSchemas.AuthorSchema);
generateClassesForSchema(baseSchemas.ListSchema);
generateClassesForSchema(baseSchemas.ItemSchema);
generateClassesForSchema(baseSchemas.FacetSchema);

let payloads = [];
for (let i = 1; i <= config.NUM_LISTS; i++) {
  let payload = generateListFixture(i);
  makeItemsForList(payload, i);

  writeFile(`./public/fixtures/list_${payload.data.id}.json`, payload, true);
  payloads.push(payload);
}

let allPayload = {
  data: [],
  included: []
}
payloads.forEach(p => {
  allPayload.data.push(p.data);
  allPayload.included.push(...p.included);
});

writeFile(`./public/fixtures/list.json`, allPayload, true);

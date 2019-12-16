const generateAdapter = require('../generators/adapter-class');
const generateModel = require('../generators/model-class');
const generateSerializer = require('../generators/serializer-class');
const config = require('../config');

let KlassCache = Object.create(null);
module.exports = function generateClassesForSchema(schema) {
  if (KlassCache[schema.type]) {
    return;
  }
  let KlassName = schema.type.charAt(0).toUpperCase() + schema.type.substr(1);

  if (config.GENERATE_ADAPTER) {
    generateAdapter(schema.type, KlassName);
  }
  if (config.GENERATE_MODEL) {
    generateModel(schema, KlassName);
  }
  if (config.GENERATE_SERIALIZER) {
    generateSerializer(schema.type, KlassName);
  }

  KlassCache[schema.type] = true;
}

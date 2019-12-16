const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const Alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const lorem = new LoremIpsum();
const invalidFieldNames = [
  'id',
  'currentState',
  '_internalModel',
  'for',
  'in',
  'of',
  'class',
  'function',
  'let',
  'var',
  'const',
  'import',
  'export',
  'default',
  'Set',
  'Map',
  'WeakMap',
  'interface',
  'type',
  'fieldName',
  'description',
  'item',
  'do',
  'while'
];


let FieldNames = {};
function getFieldName(facetType) {
  if (FieldNames[facetType]) {
    return FieldNames[facetType];
  }
  let fieldName = lorem.generateWords(1);
  while(invalidFieldNames.indexOf(fieldName) !== -1) {
    fieldName = lorem.generateWords(1);
  }
  FieldNames[facetType] = fieldName;
  return fieldName;
}


module.exports = function generateFacet(itemRef, typeCount, idIndex) {
  let alphaNum = Alphabet[idIndex - 1];
  let facetType = `facet${typeCount.toString(16)}m`;
  let fieldName = getFieldName(facetType);

  let facet = {
    type: facetType,
    id: `${facetType}:${alphaNum}`,
    attributes: {
      description: lorem.generateSentences(1),
      fieldName,
      [fieldName]: lorem.generateWords(3)
    },
    relationships: {
      item: {
        data: itemRef
      }
    }
  };

  return facet;
}

const generateClassesForSchema = require('./classes-for-schema');
const generateItemFixture = require('../generators/item-fixture');
const generateFacetFixture = require('../generators/facet-fixture');
const config = require('../config');

let totalItemCount = 0;
module.exports = function makeItemsForList(listPayload, listIndex) {
  const LIST_REF = { type: listPayload.data.type, id: listPayload.data.id };
  const listIncluded = listPayload.included;
  const listItemData = listPayload.data.relationships.items.data;

  for (let j = 1; j <= config.ITEMS_PER_LIST; j++) {
    totalItemCount++;
    let itemPayload = generateItemFixture(LIST_REF, listIndex, j);
    let ITEM_REF = { type: itemPayload.data.type, id: itemPayload.data.id };
    listIncluded.push(itemPayload.data);
    listItemData.push(ITEM_REF);

    makeFacetsForItem(itemPayload, totalItemCount, listIncluded);
  }
}

function makeFacetsForItem(itemPayload, itemCount, allIncluded) {
  const ITEM_REF = { type: itemPayload.data.type, id: itemPayload.data.id };
  const itemIncluded = itemPayload.included;
  const itemFacets = itemPayload.data.relationships.facets.data;

  for (let k = 1; k <= config.FACETS_PER_ITEM; k++) {
    let facet = generateFacetFixture(ITEM_REF, itemCount, k);
    generateClassesForSchema(facet);

    itemIncluded.push(facet);
    itemFacets.push({ type: facet.type, id: facet.id });
    allIncluded.push(facet);
  }
}

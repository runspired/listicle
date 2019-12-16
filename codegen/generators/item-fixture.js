const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 12,
    min: 8
  }
});

module.exports = function generateItem(listRef, listIndex, itemInList) {
  let data = {
    type: "item",
    id: `item:${listIndex}:${itemInList}`,
    attributes: {
      text: lorem.generateSentences(3)
    },
    relationships: {
      facets: {
        data: []
      },
      list: {
        data: listRef
      }
    }
  };

  return {
    data,
    included: []
  };
}

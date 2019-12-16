const generateAuthorFixture = require('./author-fixture');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 12,
    min: 8
  }
});

module.exports = function generateList(i) {
  let data = {
    type: "list",
    id: `list:${i}`,
    attributes: {
      title: lorem.generateSentences(1)
    },
    relationships: {
      author: {},
      items: {
        data: []
      }
    }
  };
  let payload = {
    data,
    included: []
  };

  let author = generateAuthorFixture({ type: data.type, id: data.id }, i);
  payload.included.push(author);
  data.relationships.author.data = { type: author.type, id: author.id };

  return payload;
}

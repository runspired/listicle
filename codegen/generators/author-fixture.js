const faker = require('faker');

module.exports = function makeAuthor(listRef, listIndex) {
  return {
    type: 'author',
    id: `author:${listIndex}`,
    attributes: {
      name: faker.name.findName(),
      profileImageSrc: faker.image.imageUrl()
    },
    relationships: {
      lists: {
        data: [listRef]
      }
    }
  }
}

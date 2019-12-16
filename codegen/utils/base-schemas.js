const AuthorSchema = {
  type: 'author',
  attributes: {
    name: '',
    profileImageSrc: ''
  },
  relationships: {
    lists: {
      data: []
    }
  }
}
const ListSchema = {
  type: "list",
  attributes: {
    title: ""
  },
  relationships: {
    items: {
      data: []
    },
    author: {
      data: {}
    }
  }
};
const ItemSchema = {
  type: "item",
  attributes: {
    text: ""
  },
  relationships: {
    list: {
      data: {}
    },
    facets: {
      data: []
    }
  }
};
const FacetSchema = {
  type: "facet",
  attributes: {
    fieldName: ''
  },
  relationships: {
    item: {
      data: {}
    }
  }
};

module.exports = {
  AuthorSchema,
  ListSchema,
  ItemSchema,
  FacetSchema,
}

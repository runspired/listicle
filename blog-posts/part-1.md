# Optimizing your App with EmberData (Part 1)

**_Welcome!_**

Over the next few weeks we are going to build an application using EmberData and optimize it. The application we are building is called **Listicle**. Listicle is a deceptively simple app presenting many commonly seen data structures. It is intentionally designed to incorporate some of the worst performance scenarios that applications routinely encounter.

We're building Listicle as a starting point. We're going to start with an app with abysmal performance, and iterate until we have the same app with great performance. This series is for beginner and experts alike, whether you build applications with Ember, or not. Whether you like EmberData, and especially _if not._

**_EmberData Crash Course_**

If you've never used EmberData before, I'd recommend starting with learning a bit about the architecture and history from my presentation at [EmberFest 2019](https://www.youtube.com/watch?v=zbqbsOyLM30&list=PLN4SpDLOSVkT0e094BZhGkUnf2WBF09xx&index=23&t=0s). You can also read through the [Guides](https://guides.emberjs.com/release/models/).

**_Our Application_**

**Listicle** is an application full of Top 20 lists for you to read, and the simple setup of a feed to scroll through available lists. As the name suggests, each list has 20 items. And of course, our lists are created by our wonderful staff of authors.

Let's look at how we model `Author`, `List` and `Item`.

```js
// models/author.js
import Model, { attr, hasMany } from '@ember-data/model';

export default class Author extends Model {
  @attr name;
  @attr profileImageUrl;
  @hasMany('list', { async: true, inverse: 'author' })
  lists;
}

// models/list.js
import Model, { attr, hasMany } from '@ember-data/model';

export default class List extends Model {
  @attr title;
  @hasMany('item', { async: true, inverse: 'list' })
  items;
  @belongsTo('author', { async: true, inverse: 'lists' })
  author;
}

//models/item.js
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Item extends Model {
  @attr description;
  @belongsTo('list', { async: true, inverse: 'items' })
  list;
  @hasMany('facet', { async: true, polymorphic: true, inverse: 'item' })
  facets;
}
```

You'll notice that each item additionally has **facets** (the reasons why this item is great!). In Listicle, every item included on a list has 5 characteristics that make it so great!

Because our Top 20 lists could be anything, facets are [polymorphic](https://en.wikipedia.org/wiki/Subtyping): each item having its own type of facets with their own unique properties.

```js

// models/facet.js
import Model, { attr, belongsTo } from '@ember-data/model';

// The base class for our polymorphic Facets
export default class Facet extends Model {
  @attr fieldName; // fieldName specifies the key of a polymorphic attr
  @belongsTo('item', { async: true, inverse: 'facets' })
  item;
}

// models/item1-facet.js
import { attr } from '@ember-data/model';
import Facet from './facet';

// All of our facets follow this convention
/*
export default Item<N>Facet extends Facet {
  @attr [fieldName];
}
*/
// So if the value of `fieldName` were color
export default Item1Facet extends Facet {
  @attr color;
}
```

> Note: Yes this Facet could be modeled without polymorphism by having a generic `value` attr. But this form of polymorphism is currently fairly common and more importantly "real" applications often have dozens to thousands of models. This setup gives us a convenient way of exploring data at both large and small scales.

One final note on our initial design. **We're going to create an [Adapter](https://api.emberjs.com/ember-data/3.14/modules/@ember-data%2Fadapter) and a [Serializer](https://api.emberjs.com/ember-data/3.14/modules/@ember-data%2Fserializer) for every single Model type.** This is to mirror a common mistake that many Ember applications make when using EmberData.

**Listicle** is conceived of as a small app-shell full of rich content lists. But what happens as our content grows? On January 1st, 2020 Listicle opens for business and begins publishing one new post a day.

By mid-July Listicle has produced 200 lists! Our site, which early on had felt snappy and fast to the users that poured into read our hottest articles has now slowed to a crawl.  And where initially as engineers we were happy and productive, now our build times have slowed to a crawl.

**_What happened?_**

Initially (ignoring authors) there was only one list to fetch, with 20 items, and 5 facets. 26 total records, 4 total Model classes, 12 total classes counting Adapters and Serializers. But as Listicle has grown we added more Models, Adapters, and Serializers to handle all these facets.

And now, 200 days in, we've got 200 lists, 4k items, 20k facets and 12009 total classes. Oof.

This may sound contrived, but this is far smaller yet still representative of what an application I write infrastructure for looked like 3 years ago. This helps to show why certain architectural choices for EmberData failed: leading too many apps to have bad performance by default. More importantly, refactoring this application will illuminate why other architectural choices in EmberData are solid, providing value to both large and small apps alike, and why we are rebuilding over the top of them. 

Now that we've introduced Listicle, it's time to dig in. You can follow along with the code for this series by watching the [listicle repository](https://github.com/runspired/listicle).

Our first step, generate the application we are building using Octane and Yarn.

```cli
ember new listicle --yarn -b @ember/octane-app-blueprint --no-welcome
```

**In my next post,** we'll implement a mock API and explore the data it returns.

In the mean time, you can learn more about the architecture of EmberData from my presentation at [EmberFest 2019](https://www.youtube.com/watch?v=zbqbsOyLM30&list=PLN4SpDLOSVkT0e094BZhGkUnf2WBF09xx&index=23&t=0s)!

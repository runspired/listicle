# Optimizing your App with EmberData (Part 2)

**_Embracing an API Standard_**

This is Part 2 of a series in which we build an application and optimize it's data
management. If you haven't read it yet you should start with [Part 1](https://runspired.com/2019/12/15/optimizing-your-app-with-ember-data/).

EmberData focuses on helping you manage four key concerns in your application.

- **Network:** Making network requests for data
- **Cache:** Managing a cache of data
- **Presentation:** Presenting that data to the UI
- **Mutation:** Managing local editing of data

Over the course of this series we are going to look at each of these concerns as we
optimize our application. This post focuses on the **Network** portion, specifically it investigates a little into the motivations for `JSON:API` as a format and what the future of `JSON:API` in EmberData is.

**_The Network Layer_**

If EmberData's store service does not have enough information locally available to fulfill a request for data from the application, EmberData will forward the request to an adapter to retrieve data from somewhere else.

Somewhere else could be any manner of things including LocalStorage, IndexDB, the other end of a Websocket Request, or an API accessed via Fetch.

Once the [Adapter](https://api.emberjs.com/ember-data/release/modules/@ember-data%2Fadapter) responds, anything returned by it is passed to a [Serializer](https://api.emberjs.com/ember-data/release/modules/@ember-data%2Fserializer) to be normalized into [JSON:API](https://jsonapi.org/format/).

![Request Flow]('./images/part-2/request-flow.png "Request Flow")

**_Why JSON:API?_**

When EmberData was first written, there weren't any other specs for APIs optimized for consumption by a client. API driven design itself was in it's infancy and most APIs were either built to drive server rendered applications or provide bare-bones access to third-parties.

Libraries that manage data need a way to understand the structure of the data they are managing. Out of this need, a format began forming within EmberData. Ultimately this format continued to evolve and became formalized into the `JSON:API` specification. The format quickly outgrew EmberData itself, and today the default configuration for EmberData only implements and utilizes a subset of the fuller spec.

EmberData uses `JSON:API` to communicate between your API and the cache. A complaint I sometimes hear is that this use of `JSON:API` is confusing, and for some applications the format may be too limiting.

We've heard these concerns, and we recognize that standards have progressed over time. With this in mind, we've encapsulated the primitives within EmberData and exposed public interfaces for them in a way that enables configurations to be built for EmberData that natively work with any format. Meanwhile, [Project Trim](https://github.com/emberjs/data/issues/6166) has been underway to ensure that applications configuring EmberData differently don't carry the cost of features that are unused or defaults they don't need.

But while we are working to ensure that EmberData's primitives are flexible enough to provide best-in-class value for any format, don't pour one out for `JSON:API` just yet. The spec still brings incredible value that we haven't seen matched in other specifications. The potential introduction of [extensions](https://github.com/json-api/json-api/issues/1435) has the promise of addressing many long-standing needs.

So with this in mind, what is that value? I could probably write an entire series on that alone. This is not that series, but I'll cover a couple of key points that are relevant to this series as well as to new features now available in EmberData.

**_JSON:API is optimized for client consumption_**

What does this mean? Especially, what does this mean when so often the complaint is that JSON:API seems needlessly verbose.

Typically the manner in which data from an API is consumed in an application is flattened. Most of the concepts behind state management in every framework and data library revolve around how to flatten data for consumption. Sometimes flattening is to ease presentation by eliminating wrapper objects, other times it is to increase observability, and still others it happens to enforce immutability.

This transformation comes with costs, especially for APIs whose payloads don't follow a consistent format or which use a standard without enough detail. But as we will see in this series, even when your API **is** consistent-and-detailed, applications can face serious problems managing data as those applications grow in size.

Redux reducers? Component decomposition? EmberData Models? Each of these is a different way of flattening data. When faced with the cost of transformation many engineers rightly begin to suspect that their API should be doing more flattening. But there's a trade-off: the more you flatten the more structural information is lost, the harder the mental model becomes, and the more heuristics or client-side logic you must add to restore that information when needed.

Now, while this blog post and this blog series is not intended to extol the values of `JSON:API` as a spec, we will be using it throughout because of the descriptively rich information provided by payloads formatted with it. Let's take a look at what it brings to the table.

**_A Quick Intro to JSON:API_**

`JSON:API`'s structure provides an ideal level of detail for most applications. To demonstrate this let's take a quick tour at how the `JSON:API` specification handles resources.

There are two things to note:

(1) in the spec, `type`, `id` and all members within `attributes` and `relationships` on a [resource](https://jsonapi.org/format/#document-resource-objects) share a single namespace but a nested structure. This nested structure gives us additional information about the importance and role of a given member.

(2) All of the resources returned in a payload are hoisted to the top of the response document. If you consider each response as a graph with each resource as a node in the graph, this has the effect of preventing us needing to eagerly deeply iterate the returned graph to discover the nodes.

For example, below we have the response for a single user resource. The primary data is contained in the `data` key on the response document (our graph entry point). This resource has the members `type`, `id`, `name` and `friends`. This user has a single friend, which is also included in the payload and hoisted to the top level in `included`.

```json
{
  "data": {
    "type": "user",
    "id": "1",
    "attributes": {
      "name": "Chris Thoburn"
    },
    "relationships": {
      "friends": {
        "data": [
          {
            "type": "user",
            "id": "2"
          }
        ]
      }
    }
  },
  "included": [
    {
      "type": "user",
      "id": "2",
      "attributes": {
        "name": "Gaurav Munjal"
      },
      "relationships": {
        "friends": {
          "data": [
            {
              "type": "user",
              "id": "1"
            }
          ]
        }
      }
    }
  ]
}
```

`JSON:API` is a rich structure for easily describing potentially cyclical graph data. In the above graph _user 1_ and _user 2_ each has the other as a friend, and we know that these nodes in the graph touch each other because the `relationships` object for each describes these graph edges.

We can observe the value in this when we attempt a simpler flatter `JSON` representation:

```json
{
  "type": "user",
  "id": "1",
  "name": "Chris Thoburn",
  "friends": [
    {
      "type": "user",
      "id": "2",
      "name": "Gaurav Munjal",
      "friends": []
    }
  ]
}
```

The value of `JSON:API` as a spec is not limited to its ability to accurately describe graphs. Payloads will often contain the same resource multiple times in multiple locations, and often multiple payloads will have overlapping edges in the graph.

While some formats would require you deeply iterate the graph to discover all of the available nodes, `JSON:API` hoists all nodes (resources) to the top of the document. This makes caching by resource quick and easy, and it makes joining two or more graphs together equally easy.

`JSON:API` balances providing a descriptive data structure with a flattened graph to maximize the information that consuming applications can use to present that data.

But `JSON:API` is also very verbose. Why write `user.relationships.friends.data[0].name` when you could write `user.friends[0].name` ? The former format is better for describing the graph in a serialized format, the latter format is better for consuming it, and this is where libraries like EmberData and Redux come into play by providing a mechanism to flatten the data into the ideal format for consumption.

**_`JSON:API` works well for graphs, so what?_**

Mostly we just need a robust spec for our payloads. Any spec providing similar value would work just as well. I hope if you aren't convinced already that the value in adopting a spec will become increasingly clear over the course of this series.

**In my next post,** we'll add some tooling for monitoring build times, asset sizes, and rendering performance as CI jobs using Github Actions. Why? Because you can't improve if you don't measure, and it's easy to regress if you don't monitor.

In the mean time, if you have any questions please ask them on this [forum thread](https://discuss.emberjs.com/t/optimizing-your-app-with-emberdata/17331), on [Twitter](https://twitter.com/runspired), or in the [Ember Community Discord Server](https://discordapp.com/invite/zT3asNS).

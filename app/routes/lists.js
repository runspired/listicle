import Route from "@ember/routing/route";
import { all } from "rsvp";

export default class ListsRoute extends Route {
  async model() {
    const { store } = this;
    let promises = [];
    // fetch all 200 lists
    // each list will have 10 items
    // each item will include 3 related items
    // for a total of 500 item records + 50 list records + 1500 related items
    for (let i = 1; i <= 200; i++) {
      promises.push(store.findRecord("list", `list:${i}`));
    }
    return await all(promises);
  }
}

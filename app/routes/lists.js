import Route from "@ember/routing/route";
import { inject } from '@ember/service';
import { all } from "rsvp";

export default class ListsRoute extends Route {
  @inject store;

  /*
  async model() {
    const { store } = this;
    let promises = [];
    // fetch 50 lists
    // each list will have 10 items
    // each item will include 3 related items
    // for a total of 500 item records + 50 list records + 1500 related items
    for (let i = 1; i <= 50; i++) {
      promises.push(store.findRecord("list", `list:${i}`));
    }
    return await all(promises);
  }
  */
 model() {
   return this.store.findAll('list');
 }
}

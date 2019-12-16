import { all } from 'rsvp';
// import fetch from 'fetch';

function fixUrlForFastboot(url) {
  return `http://localhost:4200` + url.substr(1);
}

export default class ApplicationAdapter {
  constructor() {
    this.currentTransaction = null;
    this.transactionPromise = null;
  }

  request(promise) {
    return promise;
    if (this.currentTransaction) {
      let len = this.currentTransaction.push(promise);
      return this.transactionPromise.then(r => r[len - 1]);
    }
    this.currentTransaction = [promise];
    this.transactionPromise = Promise.resolve()
      .then(() => {
        let transaction = this.currentTransaction;
        this.currentTransaction = null;
        this.transactionPromise = null;
        return all(transaction);
      });
    return this.transactionPromise.then(r => r[0]);
  }
  findAll(store, { modelName }) {
    return fetch(`./fixtures/${modelName}.json`)
      .then(result => result.json());
  }

  findRecord(store, { modelName }, id) {
    const promise = fetch(`./fixtures/${modelName}_${id}.json`)
      .then(result => result.json());
    return this.request(promise);
  }
  static create() {
    return new this();
  }
}

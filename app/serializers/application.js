export default class ApplicationSerializer {
  normalizeResponse(_, __, payload) {
    return payload;
  }
  static create() {
    return new this();
  }
}

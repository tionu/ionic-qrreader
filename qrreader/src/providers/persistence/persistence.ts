import {Injectable} from '@angular/core';

@Injectable()
export class PersistenceProvider {

  results: String[];

  constructor() {
    this.results = [];
  }

  storeResult(text: String) {
    this.results.unshift(text);
  }

  getResults() {
    return this.results;
  }

}

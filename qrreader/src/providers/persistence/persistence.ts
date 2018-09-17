import {Injectable} from '@angular/core';

@Injectable()
export class PersistenceProvider {

  results: String[];
  properties: any;


  constructor() {
    this.results = [];
    this.properties = {};
  }

  storeResult(text: String) {
    this.results.unshift(text);
  }

  getResults() {
    return this.results;
  }

}

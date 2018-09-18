import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ScannerPage} from "../scanner/scanner";
import {PersistenceProvider} from "../../providers/persistence/persistence";

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  constructor(private persistence: PersistenceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.persistence;
  }

  gotoScanner() {
    this.navCtrl.push(ScannerPage);
  }

}

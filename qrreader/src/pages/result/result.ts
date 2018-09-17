import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ScannerPage} from "../scanner/scanner";
import {PersistenceProvider} from "../../providers/persistence/persistence";

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  scanResults: String[];

  constructor(private persistence: PersistenceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.scanResults = this.persistence.getAllTransientTexts();
  }

  gotoScanner() {
    this.navCtrl.push(ScannerPage);
  }

}

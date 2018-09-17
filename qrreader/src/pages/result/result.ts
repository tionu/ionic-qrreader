import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ScannerPage} from "../scanner/scanner";

@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  scanResult: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    if (!this.navParams.get('scanResult')) {
      this.scanResult = this.navParams.get('scanResult');
    }
  }

  gotoScanner() {
    this.navCtrl.push(ScannerPage);
  }

}

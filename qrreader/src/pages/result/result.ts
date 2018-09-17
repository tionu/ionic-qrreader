import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ScannerPage} from "../scanner/scanner";

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  scanResult: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    if (this.navParams.get('scanResult') != null) {
      this.scanResult = "x" + this.navParams.get('scanResult') + "x";
    }
  }

  gotoScanner() {
    this.navCtrl.push(ScannerPage);
  }

}

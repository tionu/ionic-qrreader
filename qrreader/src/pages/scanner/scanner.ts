import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ResultPage} from "../result/result";
import {PersistenceProvider} from "../../providers/persistence/persistence";

declare var QRReader;

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})

export class ScannerPage {

  log: String;

  constructor(private persistence: PersistenceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.log = "";
  }

  ionViewDidLoad() {
    this.scan();
  }

  private scan() {
    QRReader.scan((error, result) => {
      this.stopScan()
      if (error) {
        this.log += "<br>QRReader: " + error;
      } else {
        this.persistence.storeResult(result);
        this.navCtrl.setRoot(ResultPage);
      }
    });
  }

  private stopScan() {
    if (QRReader.videoTag && QRReader.videoTag.srcObject) {
      QRReader.videoTag.srcObject.getTracks().forEach(track => track.stop());
      QRReader.videoTag.srcObject = null;
    }
    QRReader.active = false;
  }

}

import {Component, ViewChild} from '@angular/core';
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
  @ViewChild('displayScanAnimation') displayScanAnimation;

  constructor(private persistence: PersistenceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.log = "";
  }

  ionViewDidLoad() {
    if (this.persistence.properties['cameraPermission']) {
      this.scan();
    } else {
      this.checkCameraPermission();
    }
  }

  ionViewWillLeave() {
    if (QRReader.videoTag && QRReader.videoTag.srcObject) {
      QRReader.videoTag.srcObject.getTracks().forEach(track => track.stop());
      QRReader.videoTag.srcObject = null;
    }
    QRReader.active = false;
  }

  private scan() {
    QRReader.scan((error, result) => {
      this.displayScanAnimation.nativeElement.style = 'display:none';
      if (error) {
        this.log += "<br>QRReader: " + error;
      } else {
        this.persistence.storeResult(result);
        this.navCtrl.setRoot(ResultPage);
      }
    });
    setTimeout(() => {
      this.displayScanAnimation.nativeElement.style = 'display:block';
    }, 1500);
  }

  private checkCameraPermission() {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      stream.getTracks().forEach(track => track.stop());
      this.persistence.properties['cameraPermission'] = true;
      this.scan();
    })
      .catch((error) => {
        this.log += "<br>Camera: " + error;
        this.persistence.properties['cameraPermission'] = false;
      });
  }

}

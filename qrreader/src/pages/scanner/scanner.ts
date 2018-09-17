import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ResultPage} from "../result/result";

declare var QRReader;

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})

export class ScannerPage {

  log: String;
  private cameraPermission: boolean;
  @ViewChild('displayScanAnimation') displayScanAnimation;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.log = "";
  }

  ionViewDidLoad() {
    if (this.cameraPermission) {
      this.scan();
    } else {
      this.checkCameraPermission();
    }
  }

  ionViewWillLeave() {
    if (QRReader.videoTag) {
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
        this.navCtrl.setRoot(ResultPage, {scanResult: result});
      }
    });
    setTimeout(() => {
      this.displayScanAnimation.nativeElement.style = 'display:block';
    }, 1500);
  }

  private checkCameraPermission() {
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      stream.getTracks().forEach(track => track.stop());
      this.cameraPermission = true;
      this.scan();
    })
      .catch((error) => {
        this.log += "<br>Camera: " + error;
        this.cameraPermission = false;
      });
  }

}

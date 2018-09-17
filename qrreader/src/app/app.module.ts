import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ScannerPage} from "../pages/scanner/scanner";
import {ResultPage} from "../pages/result/result";
import {PersistenceProvider} from '../providers/persistence/persistence';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ScannerPage,
    ResultPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ScannerPage,
    ResultPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PersistenceProvider
  ]
})
export class AppModule {
}

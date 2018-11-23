import { HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { CelulaService } from './../providers/celula/celula.service';
import { Geolocation } from '@ionic-native/geolocation';
import { EnderecoProvider } from '../providers/endereco/endereco';
import { AuthService } from '../providers/auth/auth-service';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { LoadingService } from '../providers/loading.service';
import { FirebaseMessagingProvider } from '../providers/firebase-messaging';
import 'firebase/messaging';
import { IonicStorageModule } from '@ionic/storage';
import { GrupoService } from '../providers/grupo/grupo.service';
import { IgrejaService } from '../providers/igreja/igreja.service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    IonicStorageModule.forRoot(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CelulaService,
    GrupoService,
    Geolocation,
    EnderecoProvider,
    AuthService,
    LoadingService,
    IgrejaService,
    FirebaseMessagingProvider
  ]
})
export class AppModule {}

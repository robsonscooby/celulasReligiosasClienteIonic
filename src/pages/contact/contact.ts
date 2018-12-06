import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth-service';
import { Membro } from '../../model/membro.model';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  membro: Membro;

  constructor(public auth: AuthService, public navCtrl: NavController) {
    this.membro = auth.getInformation();
    if (this.membro.thumbnailURL == undefined) {
      this.membro.thumbnailURL = 'assets/imgs/logo.png';
    }
  }

  ionViewDidLoad() {}

  openInfo(): void {
    this.navCtrl.push('AboutPage');
  }

}

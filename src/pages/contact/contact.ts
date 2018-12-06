import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth-service';
import { Membro } from '../../model/membro.model';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging';
import { LoadingService } from '../../providers/loading.service';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  membro: Membro;
  notification: boolean = false;
  cont: number = 0;

  constructor(public auth: AuthService, 
    public navCtrl: NavController,
    private fireMesseg: FirebaseMessagingProvider,
    public loadingService: LoadingService,
    private alertCtrl: AlertController) {}

  ionViewDidLoad() {}

  ionViewCanEnter() {
    this.membro = this.auth.getInformation();
    if (this.membro.thumbnailURL == undefined) {
      this.membro.thumbnailURL = 'assets/imgs/logo.png';
    }

    if(this.membro.tk){
      this.notification = true;
    }
  }

  openInfo(): void {
    this.navCtrl.push('AboutPage');
  }

  openEdit(): void {
    this.navCtrl.push('RegisterPage',{'membro' : this.membro});
  }

  async activeNotification(): Promise<void> {
    try {
      await this.loadingService.present('Ativando Notificações...');
      await this.fireMesseg.createSubscribe(this.membro);
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    }
  }

  async disableNotification(): Promise<void> {
    try {
      await this.loadingService.present('Desativando Notificações...');
      await this.fireMesseg.disableNotifications(this.membro);
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    }
  }

  async presentAlertConfirmation(): Promise<void> {
  if(this.cont === 0){
    let msg;
    if(this.notification){
      msg = 'Ativar Notificações?';
    }else{
      msg = 'Cancelar Notificações?';
    }
    const alert = await this.alertCtrl.create({
      title: msg,
      //message: msg,
      buttons: [
        {
          text: 'Não',
          handler: () => {
            this.notification = !this.notification;
          }
        },
        {
          text: 'Sim',
          handler: () => {
            if(this.notification){
              this.activeNotification();
            }else{
              this.disableNotification(); 
            }
            this.cont = 0;
          }
        }
      ]
    });
      this.cont++; 
      await alert.present();
    }else{
      this.cont = 0;
      return;
    }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula.model';
import { LoadingService } from '../../providers/loading.service';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging';
import { AuthService } from '../../providers/auth/auth-service';
import { App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  bkList: Observable<Celula[]>
  celulaList: Observable<Celula[]>
  icon: string = 'ios-log-in';
  
  constructor(
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController, 
    public params: NavParams,
    public loadingService: LoadingService,
    public fireMessege: FirebaseMessagingProvider,
    public authService: AuthService,
    public app: App) {

      if(this.authService.getCode() == null){
        this.icon = 'ios-log-in';
      }else{
        this.icon = 'ios-log-out';
      }
  
      this.celulaList = params.data;
      this.bkList = this.celulaList;
  }

  ionViewWillLoad() {}

  async openPageLogin() :Promise<void> {
    if(this.authService.getCode() == null){
      this.app.getRootNav().setRoot('LoginPage');
    }else{
      await this.authService.signOut();
      this.app.getRootNav().setRoot('TabsPage'); 
    }
    
  }

  more(celula: Celula) :void {
    this.navCtrl.push('DetailPage', {'celula' : celula});
  }

  filterItems(ev: any) {
    this.celulaList = this.bkList;
    let val = ev.target.value;
    if(val){
      return this.celulaList = this.celulaList.map(cel => cel.filter((c) => 
        c.nome.toLowerCase().includes(val.toLowerCase())
      ));
    }
  }
}
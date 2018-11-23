import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, ItemSliding } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula.model';
import { LoadingService } from '../../providers/loading.service';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging';
import { AuthService } from '../../providers/auth/auth-service';

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
    public authService: AuthService) {

      if(this.authService.getCode() == null){
        this.icon = 'ios-log-in';
      }else{
        this.icon = 'ios-log-out';
      }
  
      this.celulaList = params.data;
      this.bkList = this.celulaList;
  }

  ionViewWillLoad() {
    // this.loading.present();
    // this.afAuth.authState.subscribe(data => {
    //   if (data && data.email && data.uid) {
    //     this.toast.create({
    //       message: `Bem vindo!, ${data.email}`,
    //       duration: 3000
    //     }).present();
    //   } else {
    //     this.toast.create({
    //       message: `Não foi possível se autenticação.`,
    //       duration: 3000
    //     }).present();
    //   }
    // })
    // this.loading.dismiss();
  }

  openPageLogin() :void {
    if(this.authService.getCode() == null){
      this.navCtrl.push('LoginPage');
    }else{
      this.authService.signOut();
      this.navCtrl.setRoot('TabsPage');
    }
    
  }

  more(item: ItemSliding, celula: Celula) :void {
    item.close();
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
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FormBuilder, Validators } from '@angular/forms';
import { Membro } from '../../model/membro.model';
import { EnderecoProvider } from '../../providers/endereco/endereco';
import { MembroService } from '../../providers/membro/membro.service';
import { LoadingService } from '../../providers/loading.service';
import { IgrejaService } from '../../providers/igreja/igreja.service';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public loginForm: any;
  messageEmail = ""
  messagePassword = "";
  errorEmail = false;
  errorPassword = false;
  membro = {} as Membro;

  constructor(
    private afAuth: AngularFireAuth, 
    private toastCtrl: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    private enderecoService: EnderecoProvider,
    private membroService: MembroService,
    public loading: LoadingService,
    private igrejaService: IgrejaService,
    private alertCtrl: AlertController) {

      this.loginForm = formBuilder.group({
        nome: ['', Validators.required],
        tel: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        email: ['', Validators.required],
        senha: ['', Validators.required],
        code: ['', Validators.required],
      });
  }

  async registerLogin() {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    try {
      await this.loading.present('Cadastrando...');
      await this.afAuth.auth.createUserWithEmailAndPassword(this.membro.email, this.membro.senha);
      this.membro.senha = null;
      await this.membroService.save(this.membro);
      await this.loading.dismiss();
      toast.setMessage('Cadastra realizado com sucesso.');
      this.navCtrl.pop();
    }
    catch (error) {
      await this.loading.dismiss();
      if (error.code  == 'auth/email-already-in-use') {
        toast.setMessage('O e-mail digitado já está em uso.');
      } else if (error.code  == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code  == 'auth/operation-not-allowed') {
        toast.setMessage('Não está habilitado criar cadastro.');
      } else if (error.code  == 'auth/weak-password') {
        toast.setMessage('A senha digitada é muito fraca.');
      }
      toast.present();
    }
  }

  validalogin() {
    if (this.loginForm.valid) {
      this.buscarCode(this.membro.code);
    }else{
      this.presentAlert('Favor Preencher todos os campos.');
    }
  }
    
  getEndereco() {
    this.enderecoService.getEndereco(this.membro.cep)
      .then((result: string) => {
        this.membro.endereco = result;
      })
      .catch((error: string) => {
        console.error('Erro ao tentar consultar cep.');
      });
  }

  async buscarCode(code: string): Promise<any> {
    return new Promise(async (resolve) => {
      await this.igrejaService.getAll(code).subscribe(async (res) => {
        if(!res.length){
          this.presentAlert('Código inválido!');
        }else{
          this.registerLogin();
        }
        resolve();
      });
    });
  }

  async presentAlert(msg: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Alerta',
      message: msg,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
  }

}

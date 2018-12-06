import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FormBuilder, Validators } from '@angular/forms';
import { Membro } from '../../model/membro.model';
import { EnderecoProvider } from '../../providers/endereco/endereco';
import { MembroService } from '../../providers/membro/membro.service';
import { LoadingService } from '../../providers/loading.service';
import { IgrejaService } from '../../providers/igreja/igreja.service';
import { AngularFireStorage } from 'angularfire2/storage';

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

  selectedFile: { data: any, base64: string } = { data: null, base64: null };

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
    private alertCtrl: AlertController,
    private storage: AngularFireStorage) {

      this.loginForm = formBuilder.group({
        nome: ['', Validators.required],
        tel: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        email: ['', Validators.required],
        senha1: ['', Validators.required],
        senha2: ['', Validators.required],
        code: ['', Validators.required],
      });
  }

  async registerLogin() {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    try {
      await this.loading.present('Cadastrando...');
      await this.afAuth.auth.createUserWithEmailAndPassword(this.membro.email, this.membro.senha1);  
      this.membro.senha1 = null;
      this.membro.senha2 = null;

      if (this.selectedFile) {
        await this.uploadFile();
      }

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
      if(this.validaPassword()){
        this.buscarCode(this.membro.code);
      }else{
        this.membro.senha2 = null;
        this.presentAlert('Senhas diferentes.');
      }
    }else{
      this.presentAlert('Favor Preencher todos os campos.');
    }
  }

  validaPassword(): boolean {
    return this.membro.senha1 == this.membro.senha2;
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
          this.presentAlert('Código da Igreja inválido!');
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

  async openFile(event: any): Promise<void> {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.error('Tipo de arquivo não suportado.');
      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      const base64 = reader.result as string;
      this.selectedFile.data = file;
      this.selectedFile.base64 = base64;
    };
    reader.readAsDataURL(file);
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile.data) {
      return;
    }
    try {
      const id = `${new Date().getTime()}_${this.selectedFile.data.name}`;
      const filePath = `membros/${id}`;
      const fileRef = this.storage.ref(filePath);
      await this.storage.upload(filePath, this.selectedFile.data);
      this.membro.thumbnailURL = await fileRef.getDownloadURL().toPromise();
      this.membro.thumbnailId = id;
    } catch (error) {
      console.log(error);
    }
  }

}

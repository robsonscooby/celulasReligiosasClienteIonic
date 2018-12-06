import { Injectable } from "@angular/core";
import { FirebaseApp } from 'angularfire2';
import { Membro } from "../model/membro.model";
import { MembroService } from "./membro/membro.service";

@Injectable()
export class FirebaseMessagingProvider {

    private messaging;
    private config_key_name = 'fcmTokenCelRel';
    private unsubscribeOnTokenRefresh = () => { };
    private isCreate: boolean = false;

    constructor(
        private app: FirebaseApp,
        private membroService: MembroService) { }

    public createSubscribe(membro: Membro): void {
        this.messaging = this.app.messaging();

        navigator.serviceWorker.register('service-worker.js').then((registration) => {
            if (!this.isCreate) {
                this.isCreate = true;
                this.messaging.useServiceWorker(registration);
            }
            //this.disableNotifications()
            this.enableNotifications(membro);
        });
    }

    public enableNotifications(membro: Membro) {
        //console.log('Requesting permission...');
        return this.messaging.requestPermission().then(() => {
            //console.log('Permission granted');
            // token might change - we need to listen for changes to it and update it
            this.setupOnTokenRefresh(membro);
            return this.updateToken(membro);
        });
    }

    public disableNotifications(membro: Membro) {
        this.unsubscribeOnTokenRefresh();
        this.unsubscribeOnTokenRefresh = () => { };

        navigator.serviceWorker.getRegistrations().then(function (registrations) {

            for (let registration of registrations) {
                registration.unregister();
            }
        }).catch(function (err) {
            console.log('Service Worker registration failed: ', err);
        });

        membro.tk = null;
        this.membroService.save(membro);

        if (localStorage.getItem(this.config_key_name)) {
            localStorage.removeItem(this.config_key_name);
        }
    }

    private updateToken(membro: Membro) {
        return this.messaging.getToken().then((currentToken) => {
            if (currentToken) {
                // we've got the token from Firebase, now let's store it in the database

                if (localStorage.getItem(this.config_key_name)) {
                    return;
                }

                membro.tk = currentToken;
                this.membroService.save(membro);

                return localStorage.setItem(this.config_key_name, currentToken);
            } else {
                //console.log('No Instance ID token available. Request permission to generate one.');
            }
        });
    }

    private setupOnTokenRefresh(membro: Membro): void {
        this.unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
            //console.log("Token refreshed");
            localStorage.setItem(this.config_key_name, '');
            this.updateToken(membro);
        });
    }

}
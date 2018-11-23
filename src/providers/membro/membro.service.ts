import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Membro } from '../../model/membro.model';

@Injectable()
export class MembroService {

  private PATH = 'Membros/';

  constructor(private db: AngularFireDatabase) {
  }

  getUser(email: string) {
    return this.db.list(this.PATH, ref => ref.orderByChild('email').equalTo(email))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }


  // get(igreja: Membro) {
  //   return this.db.object(this.PATH + igreja.key)
  //   .snapshotChanges()
  //     .map(c => {
  //       return { key: c.key, ...c.payload.val() };
  //     });
  // }

  save(membro: Membro) {
    return new Promise((resolve, reject) => {
      if (membro.key) {
        this.db.list(this.PATH)
          .update(membro.key, membro)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push(membro)
          .then(() => resolve());
      }
    })
  }

  // remove(key: string) {
  //   return this.db.list(this.PATH).remove(key);
  // }
}
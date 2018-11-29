import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class IgrejaService {

  private PATH = 'Igrejas/';

  constructor(private db: AngularFireDatabase) {
  }

  getAll(code: string) {
    return this.db.list(this.PATH, ref => ref.orderByChild('code').equalTo(code))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }

}
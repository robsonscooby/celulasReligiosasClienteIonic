import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Celula } from '../../model/celula.model';

@Injectable()
export class CelulaService {

  private PATH = 'Celulas/';

  constructor(private db: AngularFireDatabase) {
  }

  getAllPublic() {
    return this.db.list(this.PATH, ref => ref.orderByChild('status').equalTo(true))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  getAllPrivate(code: string) {
    return this.db.list(this.PATH, ref => ref.orderByChild('code').equalTo(code))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  get(celula: Celula) {
    return this.db.object(this.PATH + celula.key).snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      });
  }
}
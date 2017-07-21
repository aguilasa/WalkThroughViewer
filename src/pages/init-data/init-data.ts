import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-init-data',
  templateUrl: 'init-data.html',
})
export class InitDataPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }

  add() {
    console.log('oi')
  }

  drop() {
    let loading = this.loadingCtrl.create({
      content: 'Excluindo tabelas...'
    });
    loading.present().then(() => {
      this.database.dropTables().then(() => {
        loading.dismiss();
      }).catch((err) => {
        loading.dismiss();
      });
    })
  }

  ins() {
    let loading = this.loadingCtrl.create({
      content: 'Inserindo...'
    });
    loading.present().then(() => {
      this.database.insertGames().then(() => {
        loading.dismiss();
      }).catch((err) => {
        loading.dismiss();
      });
    })
  }

  del() {
    let loading = this.loadingCtrl.create({
      content: 'Excluindo...'
    });
    loading.present().then(() => {
      this.database.deleteGames().then(() => {
        loading.dismiss();
      }).catch((err) => {
        loading.dismiss();
      });
    })
  }

  home() {
    console.log('home');
    this.navCtrl.push(HomePage, {});
  }

}

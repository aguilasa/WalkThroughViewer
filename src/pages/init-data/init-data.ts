import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-init-data',
  templateUrl: 'init-data.html',
})
export class InitDataPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InitDataPage');
  }

  add() {
    console.log('oi')
  }

  drop() {
    this.database.dropTables();
  }

  ins() {
    console.log('inserindo');
    this.database.insertGames().then(() => {
      console.log('fim');
    }).catch((err) => console.log("error detected creating tables", err));
  }

  del() {

  }

  home() {
    console.log('home');
    this.navCtrl.push(HomePage, {});
  }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';
import { GamePage } from '../game/game';
import { InitDataPage } from '../init-data/init-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public title: string = "Games";
  public games: Array<any> = [];

  constructor(public navCtrl: NavController, private database: DatabaseProvider) {
    this.getGames();
  }

  private getGames() {
    this.database.getGames().then((data) => {
      this.games = data;
    }).then(() => {
      if (this.games.length == 0) {
        this.navCtrl.push(InitDataPage, {});
      }
    })
  }

  selectGame(game) {
    this.navCtrl.push(GamePage, { game });
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';
import { StepModel } from '../../models/step/step';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  public game: any;
  public step: StepModel = null;
  public total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider) {
    this.game = this.navParams.get('game');
  }

  ionViewDidLoad() {
    this.database.getActualStep(this.game.id).then((data) => {
      this.step = data;
      console.log(this.step.levelTitle);
    }).then(() => {
      this.database.getTotalSteps(this.game.id).then((data) => {
        this.total = data;
      })
    })
  }

  nextStep() {
    if (this.step.id < this.total) {
      this.database.getStep(this.step.id + 1, this.game.id).then((data) => {
        this.step = data;
      }).then(() => {
        this.database.setActualStep(this.step.id, this.game.id);
      })
    }
  }

  prevStep() {
    if (this.step.id > 1) {
      this.database.getStep(this.step.id - 1, this.game.id).then((data) => {
        this.step = data;
      }).then(() => {
        this.database.setActualStep(this.step.id, this.game.id);
      })
    }
  }

}

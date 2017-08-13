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
  public step: StepModel;
  public total: number;
  public fbEnabled: boolean = true;
  public pbEnabled: boolean = true;
  public nbEnabled: boolean = true;
  public lbEnabled: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider) {
    this.game = this.navParams.get('game');
  }

  ionViewDidEnter() {
    this.database.getActualStep(this.game.id).then((step) => {
      this.step = step;
    }).then(() => {
      this.database.getTotalSteps(this.game.id).then((data) => {
        this.total = data;
      })
    })
  }

  nextStep() {
    if (this.step.id < this.total) {
      this.database.getNextStep(this.step.id, this.game.id).then((data) => {
        this.step = data;
      }).then(() => {
        this.database.setActualStep(this.step.id, this.game.id);
      })
    }
  }

  prevStep() {
    if (this.step.id > 1) {
      this.database.getPrevStep(this.step.id, this.game.id).then((data) => {
        this.step = data;
      }).then(() => {
        this.database.setActualStep(this.step.id, this.game.id);
      })
    }
  }

  firstStep() {
    this.setStep(1);
  }

  lastStep() {
    this.setStep(this.total);
  }

  setStep(idstep: number) {
    this.database.getStep(idstep, this.game.id).then((data) => {
      this.step = data;
    }).then(() => {
      this.database.setActualStep(this.step.id, this.game.id);
    })
  }

}

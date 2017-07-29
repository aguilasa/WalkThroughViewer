import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nav-buttons',
  templateUrl: 'nav-buttons.html'
})
export class NavButtonsComponent {

  @Input() firstBtnEnabled: boolean = true;
  @Input() prevBtnEnabled: boolean = true;
  @Input() nextBtnEnabled: boolean = true;
  @Input() lastBtnEnabled: boolean = true;
  @Output() firstBtnClick = new EventEmitter();
  @Output() prevBtnClick = new EventEmitter();
  @Output() nextBtnClick = new EventEmitter();
  @Output() lastBtnClick = new EventEmitter();

  constructor() {

  }

  first() {
    this.firstBtnClick.emit();
  }

  prev() {
    this.prevBtnClick.emit();
  }

  next() {
    this.nextBtnClick.emit();
  }

  last() {
    this.lastBtnClick.emit();
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Letter, MouseAction } from '../strands';

@Component({
  selector: 'app-letter',
  imports: [],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent {
  @Input() letter!: Letter;
  @Input() isDisabled = false;
  @Input() set hintAnimationDelay(value: number) {
    if (value > 0) {
      this.hintAnimationPreparing = true;
      setTimeout(() => {
        this.hintAnimationActive = true;
      }, value);
    } else {
      this.hintAnimationPreparing = false;
      this.hintAnimationActive = false;
    }
  }
  @Output() mouseEvent = new EventEmitter<MouseAction>();

  hintAnimationPreparing = false;
  hintAnimationActive = false;

  moveX = 0;
  moveY = 0;

  @Input() set column(value: number) {
    this.moveX = 60 - (value * 60);
  }

  @Input() set row(value: number) {
    this.moveY = 20 + (8 - value) * 60;
  }

  mouseDown(event: Event) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Down);
  }

  mouseUp(event: Event) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Up);
  }

  mouseMove(event: Event) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Move);
  }

  click(event: Event) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Click);
  }
}

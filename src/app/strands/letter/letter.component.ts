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
  @Output() mouseEvent = new EventEmitter<MouseAction>();

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

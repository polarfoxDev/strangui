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

  mouseDown(event: MouseEvent) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Down);
  }

  mouseUp(event: MouseEvent) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Up);
  }

  mouseMove(event: MouseEvent) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Move);
  }

  click(event: MouseEvent) {
    event.preventDefault();
    this.mouseEvent.emit(MouseAction.Click);
  }
}

import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-option-content-with-icon',
  imports: [],
  templateUrl: './option-content-with-icon.html',
  styleUrl: './option-content-with-icon.css',
})
export class OptionContentWithIcon {
  text: InputSignal<string> = input('');
}

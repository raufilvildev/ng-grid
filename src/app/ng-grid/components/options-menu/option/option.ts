import { Component, input, InputSignal, signal } from '@angular/core';
import { IconTriangleMenu } from '../../../icons/icon-triangle-menu/icon-triangle-menu';

@Component({
  selector: 'app-option',
  imports: [IconTriangleMenu],
  templateUrl: './option.html',
  styleUrl: './option.css',
})
export class Option {
  hasAuxiliarMenu: InputSignal<boolean> = input(false);
  hasSubmenu: InputSignal<boolean> = input(false);
  showSubmenu: InputSignal<boolean> = input(false);
  isDisable: InputSignal<boolean> = input(false);
}

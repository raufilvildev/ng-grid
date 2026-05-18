import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-auxiliar-menu-container',
  imports: [],
  templateUrl: './auxiliar-menu-container.html',
  styleUrl: './auxiliar-menu-container.css',
})
export class AuxiliarMenuContainer {
  width: InputSignal<number> = input(240);
}

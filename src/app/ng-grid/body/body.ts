import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { IColDef } from '../interfaces/i-col-def';
import { ISelectionArea } from '../interfaces/i-selection-area';
import { SelectionAreaService } from './services/selection-area-service';
import { AreaSelection } from './directives/area-selection';
import { ClickOutside } from '../directives/click-outside';
import { HorizontalScrollDragging } from '../directives/horizontal-scroll-dragging';
import { ColumnsService } from '../services/columns-service';

@Component({
  selector: 'app-body',
  imports: [AreaSelection, ClickOutside],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  constructor() {
    effect(() => {
      if (this.columnsService.dragState()) {
        this.selectionArea.set({
          startRowIndex: null,
          endRowIndex: null,
          startColumnIndex: null,
          endColumnIndex: null,
        });
      }
    });
  }

  columnsService = inject(ColumnsService);
  selectionAreaService = inject(SelectionAreaService);

  colDefs: InputSignal<IColDef[]> = input<IColDef[]>([]);
  rows: InputSignal<any[]> = input<any[]>([]);
  horizontalScrollDragging: InputSignal<HorizontalScrollDragging> = input.required();

  selectionArea: WritableSignal<ISelectionArea> = signal({
    startRowIndex: null,
    endRowIndex: null,
    startColumnIndex: null,
    endColumnIndex: null,
  });
}

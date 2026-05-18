import {
  Directive,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { ISelectionArea } from '../../interfaces/i-selection-area';
import { HorizontalScrollDragging } from '../../directives/horizontal-scroll-dragging';
import { SelectionAreaService } from '../services/selection-area-service';

@Directive({
  selector: '[appSelectionArea]',
  host: { '(mousedown)': 'onMouseDown($event)' },
})
export class AreaSelection {
  constructor() {
    effect(() => {
      this.selectionAreaService.selectionArea.set(this.selectionArea());
    });
  }

  selectionAreaService = inject(SelectionAreaService);

  rowIndex: InputSignal<number> = input.required();
  columnIndex: InputSignal<number> = input.required();
  horizontalScrollDragging = input.required<HorizontalScrollDragging>();
  selectionAreaUpdate: OutputEmitterRef<ISelectionArea> = output();

  selectionArea: WritableSignal<ISelectionArea> = signal({
    startRowIndex: null,
    endRowIndex: null,
    startColumnIndex: null,
    endColumnIndex: null,
  });

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const cell: { rowIndex: number; columnIndex: number } | null = this.getMouseOverCell(event);

    if (!cell) return;

    this.selectionArea.set({
      startRowIndex: cell.rowIndex,
      endRowIndex: cell.rowIndex,
      startColumnIndex: cell.columnIndex,
      endColumnIndex: cell.columnIndex,
    });

    this.selectionAreaUpdate.emit(this.selectionArea());

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    const cell: { rowIndex: number; columnIndex: number } | null = this.getMouseOverCell(event);

    this.horizontalScrollDragging().handleHorizontalScroll(event.clientX);

    if (!cell) return;

    if (
      cell.rowIndex !== this.selectionArea().endRowIndex ||
      cell.columnIndex !== this.selectionArea().endColumnIndex
    ) {
      this.selectionArea.set({
        ...this.selectionArea(),
        endRowIndex: cell.rowIndex,
        endColumnIndex: cell.columnIndex,
      });

      this.selectionAreaUpdate.emit(this.selectionArea());
    }
  };

  onMouseUp = (event: MouseEvent) => {
    this.cleanUp();
  };

  ngOnDestroy() {
    this.cleanUp();
  }

  getMouseOverCell = (event: MouseEvent): { rowIndex: number; columnIndex: number } | null => {
    const element: Element | null = document.elementFromPoint(event.clientX, event.clientY);

    if (!element) return null;

    const cell: HTMLElement | null = element.closest('[body-cell]');

    if (!cell) return null;

    const cellDataset: DOMStringMap = cell.dataset;
    const rowIndex = Number(cellDataset['row']);
    const columnIndex = Number(cellDataset['col']);

    return { rowIndex, columnIndex };
  };

  cleanUp() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}

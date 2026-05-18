import { Directive, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { HorizontalScrollDragging } from '../../directives/horizontal-scroll-dragging';
import { ColumnsService } from '../../services/columns-service';

@Directive({
  selector: '[appColumnResize]',
  host: { '(mousedown)': 'onMouseDown($event)' },
})
export class ColumnResize {
  columnsService = inject(ColumnsService);

  tableContainer: InputSignal<HTMLElement> = input.required();
  columnIndex: InputSignal<number> = input.required();
  horizontalScrollDragging = input.required<HorizontalScrollDragging>();

  startWidth: WritableSignal<number> = signal(0);
  startX: WritableSignal<number> = signal(0);
  startScrollLeft: WritableSignal<number> = signal(0);

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.startX.set(event.pageX);
    this.startScrollLeft.set(this.tableContainer().scrollLeft);

    const element: HTMLElement | null = this.tableContainer().querySelector(
      `[head-cell][data-col="${this.columnIndex()}"]`,
    );

    if (!element) return;

    this.startWidth.set(element.offsetWidth);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    const currentX: number = event.clientX;
    const scrollOffset: number = this.tableContainer().scrollLeft - this.startScrollLeft();
    const deltaX: number = currentX - this.startX() + scrollOffset;
    const width: number = Math.max(this.startWidth() + deltaX, 75);

    this.columnsService.columnResize({ columnIndex: this.columnIndex(), width });
    this.horizontalScrollDragging().handleHorizontalScroll(event.clientX);
  };

  onMouseUp = () => {
    this.cleanUp();
  };

  ngOnDestroy() {
    this.cleanUp();
  }

  cleanUp() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}

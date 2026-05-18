import { Directive, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { HorizontalScrollDragging } from '../../directives/horizontal-scroll-dragging';
import { ColumnsService } from '../../services/columns-service';

@Directive({
  selector: '[appColumnIndexUpdate]',
  host: { '(mousedown)': 'onMouseDown($event)' },
})
export class ColumnIndexUpdate {
  private columnsService = inject(ColumnsService);

  tableContainer: InputSignal<HTMLElement> = input.required();
  columnIndex: InputSignal<number> = input.required();
  horizontalScrollDragging = input.required<HorizontalScrollDragging>();

  ghostElement: HTMLElement | null = null;

  startX: number = 0;
  startY: number = 0;
  lastSwapX: number | null = null;
  get lastSwapDirection(): 'left' | 'right' | null {
    if (this.hoverColumnIndeces.length === 0) return null;

    const last: number = this.hoverColumnIndeces[this.hoverColumnIndeces.length - 1];

    return last > this.columnIndex() ? 'right' : 'left';
  }
  hoverColumnIndeces: number[] = [];

  readonly DRAG_TOLERANCE = 5;
  readonly DRAG_TOLERANCE_AFTER_SWAP = 20;

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.lastSwapX = event.clientX;

    this.columnsService.isDragging.set(true);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    const distanceX: number = Math.abs(event.clientX - this.startX);
    const distanceY: number = Math.abs(event.clientY - this.startY);
    const movedEnough: boolean = distanceX > this.DRAG_TOLERANCE || distanceY > this.DRAG_TOLERANCE;

    if (!this.ghostElement && movedEnough) {
      this.createGhostElement(event);
    }

    if (!this.ghostElement) return;

    this.updateGhostPosition(event);
    this.horizontalScrollDragging().handleHorizontalScroll(event.clientX);

    const element = document.elementFromPoint(event.clientX, event.clientY);

    let cell = element?.closest('[head-cell]') as HTMLElement | null;

    if (!cell) {
      cell = element?.closest('[body-cell]') as HTMLElement | null;
    }

    if (
      !cell ||
      !this.tableContainer().contains(cell) ||
      isNaN(Number(cell.dataset['col'])) ||
      Number(cell.dataset['col']) === this.columnIndex()
    )
      return;

    const hovering = Number(cell.dataset['col']);

    const movingDirection: 'left' | 'right' = event.clientX < this.lastSwapX! ? 'left' : 'right';

    const currentHovering = this.hoverColumnIndeces[this.hoverColumnIndeces.length - 1];
    const isInSwappedPair = hovering === this.columnIndex() || hovering === currentHovering;

    if (isInSwappedPair && movingDirection === this.lastSwapDirection) return;

    const distanceFromLastSwapX: number = Math.abs(event.clientX - this.lastSwapX!);

    if (distanceFromLastSwapX > this.DRAG_TOLERANCE_AFTER_SWAP) {
      if (currentHovering === hovering) {
        this.hoverColumnIndeces.pop();
      } else {
        this.hoverColumnIndeces.push(hovering);
      }

      this.columnsService.dragState.set({
        columnIndexDragging: this.columnIndex(),
        columnIndexHovering: this.hoverColumnIndeces[this.hoverColumnIndeces.length - 1] ?? null,
      });

      this.lastSwapX = event.clientX;
    }
  };

  onMouseUp = () => {
    const dragState = this.columnsService.dragState();

    if (!dragState || dragState.columnIndexHovering === null) {
      this.cleanUp();
      return;
    }

    this.columnsService.columnIndexUpdate({
      currentColumnIndex: this.columnIndex(),
      newColumnIndex: dragState.columnIndexHovering,
    });
    this.cleanUp();
  };

  ngOnDestroy() {
    this.cleanUp();
  }

  createGhostElement(event: MouseEvent) {
    const element: Element | null = document.elementFromPoint(event.clientX, event.clientY);

    if (!element) return;

    const cell: HTMLElement | null = element.closest('[cell]');

    if (!cell) return;

    const ghostElement: HTMLElement = cell.cloneNode(true) as HTMLElement;
    ghostElement.style.width = cell.style.width + 'px';
    ghostElement.classList.add(
      'fixed',
      'z-10',
      'opacity-[0.5]',
      'bg-zinc-100',
      'text-zinc-900',
      'text-sm',
      'font-medium',
      'pointer-events-none',
    );

    this.ghostElement = ghostElement;

    document.body.appendChild(ghostElement);
    this.updateGhostPosition(event);
  }

  updateGhostPosition(event: MouseEvent) {
    if (!this.ghostElement) return;

    this.ghostElement.style.left = event.clientX + 'px';
    this.ghostElement.style.top = event.clientY + 'px';
  }

  cleanUp() {
    this.columnsService.dragState.set(null);
    this.ghostElement?.remove();
    this.ghostElement = null;
    this.startX = 0;
    this.startY = 0;
    this.lastSwapX = null;
    this.hoverColumnIndeces = [];
    this.columnsService.isDragging.set(false);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}

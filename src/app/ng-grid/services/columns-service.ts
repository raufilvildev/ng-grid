import { Injectable, signal, WritableSignal } from '@angular/core';
import { IColDef } from '../interfaces/i-col-def';
import { IDragState } from '../interfaces/i-drag-state';

@Injectable()
export class ColumnsService {
  internalColDefs: WritableSignal<IColDef[]> = signal([]);
  hiddenColumns: WritableSignal<string[]> = signal([]);
  dragState: WritableSignal<IDragState | null> = signal(null);
  isDragging: WritableSignal<boolean> = signal(false);

  columnResize({ columnIndex, width }: { columnIndex: number; width: number }) {
    const internalColDefs: IColDef[] = [...this.internalColDefs()];
    internalColDefs[columnIndex].width = width;
    this.internalColDefs.set(internalColDefs);
  }

  columnIndexUpdate({
    currentColumnIndex,
    newColumnIndex,
  }: {
    currentColumnIndex: number;
    newColumnIndex: number;
  }) {
    const internalColDefs: IColDef[] = [...this.internalColDefs()];
    const colDef: IColDef = { ...internalColDefs.splice(currentColumnIndex, 1)[0] };

    internalColDefs.splice(newColumnIndex, 0, colDef);

    this.internalColDefs.set(internalColDefs);
  }

  getTransform(dragState: IDragState | null, columnIndex: number, colDefs: IColDef[]): string {
    if (
      !dragState ||
      dragState.columnIndexDragging === null ||
      dragState.columnIndexHovering === null
    )
      return '';

    const from: number = dragState.columnIndexDragging;
    const to: number = dragState.columnIndexHovering;

    if (columnIndex === from) {
      if (from < to) {
        const shift = colDefs.slice(from + 1, to + 1).reduce((acc, col) => acc + col.width, 0);
        return `translateX(${shift}px)`;
      } else {
        const shift = colDefs.slice(to, from).reduce((acc, col) => acc + col.width, 0);
        return `translateX(${-shift}px)`;
      }
    }

    if (from > to && columnIndex >= to && columnIndex < from) {
      return `translateX(${colDefs[from].width}px)`;
    }

    if (from < to && columnIndex > from && columnIndex <= to) {
      return `translateX(${-colDefs[from].width}px)`;
    }

    return '';
  }

  optionsMenuPosition(
    tableContainer: HTMLElement,
    columnIndex: number | null,
  ): { top: number; left: number } | null {
    if (columnIndex === null) return null;

    const element: HTMLElement | null = tableContainer.querySelector(
      `[head-cell][data-col="${columnIndex}"]`,
    );

    if (!element) return null;

    const rect: DOMRect = element.getBoundingClientRect();

    const top: number = rect.bottom + window.scrollY;
    const left: number = rect.left + window.scrollX;

    if (!top || !left) return null;

    return { top, left };
  }
}

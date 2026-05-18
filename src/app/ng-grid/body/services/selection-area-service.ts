import { Injectable, signal, WritableSignal } from '@angular/core';
import { ISelectionArea } from '../../interfaces/i-selection-area';

@Injectable()
export class SelectionAreaService {
  selectionArea: WritableSignal<ISelectionArea> = signal({
    startRowIndex: null,
    endRowIndex: null,
    startColumnIndex: null,
    endColumnIndex: null,
  });

  isSelectedCell(
    { startRowIndex, startColumnIndex }: ISelectionArea,
    rowIndex: number,
    columnIndex: number,
  ): { isSelectedCell: boolean; class: string } {
    const isSelectedCell: boolean =
      startRowIndex !== null &&
      startColumnIndex !== null &&
      rowIndex === startRowIndex &&
      columnIndex === startColumnIndex;

    return { isSelectedCell, class: isSelectedCell ? 'bg-white' : '' };
  }

  isInSelectionArea(
    { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }: ISelectionArea,
    rowIndex: number,
    columnIndex: number,
  ): { isInSelectionArea: boolean; class: string } {
    const isSelectedCell: boolean = this.isSelectedCell(
      { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
      rowIndex,
      columnIndex,
    ).isSelectedCell;
    const isInSelectionArea: boolean =
      startRowIndex !== null &&
      endRowIndex !== null &&
      startColumnIndex !== null &&
      endColumnIndex !== null &&
      rowIndex >= Math.min(startRowIndex, endRowIndex) &&
      rowIndex <= Math.max(startRowIndex, endRowIndex) &&
      columnIndex >= Math.min(startColumnIndex, endColumnIndex) &&
      columnIndex <= Math.max(startColumnIndex, endColumnIndex);

    return { isInSelectionArea, class: !isInSelectionArea || isSelectedCell ? '' : 'bg-sky-100' };
  }

  isInSelectionAreaBorder(
    { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }: ISelectionArea,
    rowIndex: number,
    columnIndex: number,
  ): { isInSelectionAreaBorder: boolean; boxShadow: string } {
    const isSelectedCell: boolean = this.isSelectedCell(
      { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
      rowIndex,
      columnIndex,
    ).isSelectedCell;
    const isInSelectionArea: boolean = this.isInSelectionArea(
      { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
      rowIndex,
      columnIndex,
    ).isInSelectionArea;

    if (isSelectedCell) {
      return { isInSelectionAreaBorder: false, boxShadow: 'inset 0 0 0 2px #38bdf8' };
    }

    if (
      !isInSelectionArea ||
      startRowIndex === null ||
      endRowIndex === null ||
      startColumnIndex === null ||
      endColumnIndex === null
    ) {
      return { isInSelectionAreaBorder: false, boxShadow: '' };
    }

    const isInSelectionAreaBorderTop: boolean = rowIndex === Math.min(startRowIndex, endRowIndex);
    const isInSelectionAreaBorderBottom: boolean =
      rowIndex === Math.max(startRowIndex, endRowIndex);
    const isInSelectionAreaBorderLeft: boolean =
      columnIndex === Math.min(startColumnIndex, endColumnIndex);
    const isInSelectionAreaBorderRight: boolean =
      columnIndex === Math.max(startColumnIndex, endColumnIndex);

    let boxShadow: string = '';

    if (
      !isInSelectionAreaBorderTop &&
      !isInSelectionAreaBorderBottom &&
      !isInSelectionAreaBorderLeft &&
      !isInSelectionAreaBorderRight
    ) {
      return { isInSelectionAreaBorder: false, boxShadow: '' };
    }

    const shadows: string[] = [];

    if (isInSelectionAreaBorderTop) shadows.push('inset 0 1px 0 0 #38bdf8');
    if (isInSelectionAreaBorderBottom) shadows.push('inset 0 -1px 0 0 #38bdf8');
    if (isInSelectionAreaBorderLeft) shadows.push('inset 1px 0 0 0 #38bdf8');
    if (isInSelectionAreaBorderRight) shadows.push('inset -1px 0 0 0 #38bdf8');

    boxShadow = shadows.join(',');

    return { isInSelectionAreaBorder: true, boxShadow };
  }

  getSelectionAreaCellStyles(
    { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex }: ISelectionArea,
    rowIndex: number,
    columnIndex: number,
  ): { class: string; boxShadow: string } {
    return {
      class: (
        this.isSelectedCell(
          { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
          rowIndex,
          columnIndex,
        ).class +
        ' ' +
        this.isInSelectionArea(
          { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
          rowIndex,
          columnIndex,
        ).class +
        ' '
      )
        .replace('  ', ' ')
        .trim(),
      boxShadow: this.isInSelectionAreaBorder(
        { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
        rowIndex,
        columnIndex,
      ).boxShadow,
    };
  }
}

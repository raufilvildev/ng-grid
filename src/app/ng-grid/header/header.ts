import {
  afterRenderEffect,
  Component,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ColumnResize } from './directives/column-resize';
import { IconUpArrow } from '../icons/icon-up-arrow/icon-up-arrow';
import { IconDownArrow } from '../icons/icon-down-arrow/icon-down-arrow';
import { IconUpDownArrow } from '../icons/icon-up-down-arrow/icon-up-down-arrow';
import { IconFilter } from '../icons/icon-filter/icon-filter';
import { HorizontalScrollDragging } from '../directives/horizontal-scroll-dragging';
import { ColumnIndexUpdate } from './directives/column-index-update';
import { ColumnsService } from '../services/columns-service';
import { OrdersService } from '../services/orders-service';
import { OptionsMenu } from '../components/options-menu/options-menu';
import { ClickOutside } from '../directives/click-outside';
import { SelectionAreaService } from '../body/services/selection-area-service';

@Component({
  selector: 'app-header',
  imports: [
    ColumnResize,
    IconUpArrow,
    IconDownArrow,
    IconUpDownArrow,
    IconFilter,
    ColumnIndexUpdate,
    OptionsMenu,
    ClickOutside,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor() {
    afterRenderEffect(() => {
      this.columnsService.hiddenColumns();

      this.optionsMenuPosition.set(
        this.columnsService.optionsMenuPosition(
          this.tableContainer(),
          this.optionsMenuColumnIndex(),
        ),
      );
    });

    effect(() => {
      if (this.columnsService.isDragging()) {
        this.optionsMenuColumnIndex.set(null);
        this.optionsMenuPosition.set(null);
      }
    });

    effect(() => {
      this.selectionAreaService.selectionArea();

      this.optionsMenuColumnIndex.set(null);
      this.optionsMenuPosition.set(null);
    });
  }

  columnsService = inject(ColumnsService);
  ordersService = inject(OrdersService);
  selectionAreaService = inject(SelectionAreaService);

  tableContainer: InputSignal<HTMLElement> = input.required();
  horizontalScrollDragging: InputSignal<HorizontalScrollDragging> = input.required();

  optionsMenuColumnIndex: WritableSignal<number | null> = signal(null);
  optionsMenuPosition: WritableSignal<{ top: number; left: number } | null> = signal(null);

  onFilterClick(index: number) {
    this.optionsMenuColumnIndex.set(this.optionsMenuColumnIndex() === index ? null : index);
  }
}

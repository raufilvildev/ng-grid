import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MenuContainer } from '../menu-container/menu-container';
import { IColDef } from '../../interfaces/i-col-def';
import { ColumnsService } from '../../services/columns-service';
import { OrdersService } from '../../services/orders-service';

@Component({
  selector: 'app-checkbox-list',
  imports: [MenuContainer],
  templateUrl: './checkbox-list.html',
  styleUrl: './checkbox-list.css',
})
export class CheckboxList {
  columnsService = inject(ColumnsService);

  onClick(field: string) {
    let hiddenColumns: string[] = [...this.columnsService.hiddenColumns()];

    if (hiddenColumns.includes(field)) {
      hiddenColumns = hiddenColumns.filter((c) => c !== field);
    } else {
      hiddenColumns.push(field);
    }

    this.columnsService.hiddenColumns.set(hiddenColumns);
  }
}

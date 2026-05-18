import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { Header } from './header/header';
import { Body } from './body/body';
import { Footer } from './footer/footer';
import { Pagination } from './pagination/pagination';
import { IPaginationData } from './interfaces/i-pagination-data';
import { ITableData } from './interfaces/i-table-data';
import { HorizontalScrollDragging } from './directives/horizontal-scroll-dragging';
import { ColumnsService } from './services/columns-service';
import { OrdersService } from './services/orders-service';
import { PageService } from './services/page-service';
import { FiltersService } from './services/filters-service';
import { AreaSelection } from './body/directives/area-selection';
import { SelectionAreaService } from './body/services/selection-area-service';

@Component({
  selector: 'app-ng-grid',
  imports: [Header, Body, Footer, Pagination, HorizontalScrollDragging],
  templateUrl: './ng-grid.html',
  styleUrl: './ng-grid.css',
  providers: [ColumnsService, OrdersService, FiltersService, PageService, SelectionAreaService],
})
export class NgGrid {
  constructor() {
    effect(() => {
      this.filtersService.internalFilters();
      this.pageService.internalPage.set(1);
    });
    effect(() => {
      this.tableDataUpdate.emit({
        colDefs: this.columnsService.internalColDefs(),
        columnsVisibility: this.columnsService.hiddenColumns(),
        orders: this.ordersService.internalOrders(),
        filters: this.filtersService.internalFilters(),
        page: this.pageService.internalPage(),
      });
    });
  }

  columnsService = inject(ColumnsService);
  ordersService = inject(OrdersService);
  filtersService = inject(FiltersService);
  pageService = inject(PageService);

  tableData: InputSignal<ITableData | undefined> = input();
  rows: InputSignal<any[]> = input<any[]>([]);
  footer: InputSignal<any> = input<any | undefined>();
  paginationData: InputSignal<IPaginationData | undefined> = input();
  values: InputSignal<{ [key: string]: any[] }> = input({});

  tableDataUpdate: OutputEmitterRef<ITableData> = output();

  ngOnInit() {
    this.columnsService.internalColDefs.set(
      (this.tableData()?.colDefs || []).map((colDef) => ({ ...colDef })),
    );
    this.ordersService.internalOrders.set({ ...(this.tableData()?.orders || {}) });
    this.filtersService.internalFilters.set({ ...(this.tableData()?.filters || {}) });
    this.filtersService.internalValues.set(this.values() || {});
    this.pageService.internalPage.set(this.tableData()?.page || 1);
  }
}

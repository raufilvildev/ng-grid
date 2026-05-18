import { TFilters } from '../types/t-filters';
import { TOrders } from '../types/t-orders';
import { IColDef } from './i-col-def';

export interface ITableData {
  colDefs: IColDef[];
  columnsVisibility?: string[];
  orders?: TOrders;
  filters?: TFilters;
  page: number;
}

import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { Option } from './option/option';
import { MenuContainer } from '../menu-container/menu-container';
import { IconCloseEye } from '../../icons/icon-close-eye/icon-close-eye';
import { CheckboxList } from '../checkbox-list/checkbox-list';
import { IconSortAZ } from '../../icons/icon-sort-az/icon-sort-az';
import { OptionContentWithIcon } from './option/option-content-with-icon/option-content-with-icon';
import { IconAscendingOrder } from '../../icons/icon-ascending-order/icon-ascending-order';
import { IconDescendingOrder } from '../../icons/icon-descending-order/icon-descending-order';
import { AuxiliarMenuContainer } from '../auxiliar-menu-container/auxiliar-menu-container';
import { OptionWithAuxiliarMenuContainer } from '../option-with-auxiliar-menu-container/option-with-auxiliar-menu-container';
import { TOrder } from '../../types/t-order';
import { IconFilter } from '../../icons/icon-filter/icon-filter';
import { IconCheck } from '../../icons/icon-check/icon-check';
import { ValuesList } from '../values-list/values-list';
import { ColumnsService } from '../../services/columns-service';
import { OrdersService } from '../../services/orders-service';
import { FiltersService } from '../../services/filters-service';
import { FiltersByConditionSection } from '../filters-by-condition-section/filters-by-condition-section';

@Component({
  selector: 'app-options-menu',
  imports: [
    Option,
    MenuContainer,
    IconCloseEye,
    CheckboxList,
    IconSortAZ,
    OptionContentWithIcon,
    IconAscendingOrder,
    IconDescendingOrder,
    AuxiliarMenuContainer,
    OptionWithAuxiliarMenuContainer,
    IconFilter,
    IconCheck,
    ValuesList,
    FiltersByConditionSection,
  ],
  templateUrl: './options-menu.html',
  styleUrl: './options-menu.css',
})
export class OptionsMenu {
  columnsService = inject(ColumnsService);
  ordersService = inject(OrdersService);
  filtersService = inject(FiltersService);

  field: InputSignal<string> = input('');
  fieldType: InputSignal<string> = input('');

  columnSortUpdate: OutputEmitterRef<TOrder> = output();

  showFilterByConditionSubmenu: WritableSignal<boolean> = signal(false);
  showFilterByValuesSubmenu: WritableSignal<boolean> = signal(false);

  hiddenColumns: WritableSignal<string[]> = signal([]);
  hiddenValues: WritableSignal<any[]> = signal([]);
}

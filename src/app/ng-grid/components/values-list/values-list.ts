import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { IconLens } from '../../icons/icon-lens/icon-lens';
import { IconCheck } from '../../icons/icon-check/icon-check';
import { FiltersService } from '../../services/filters-service';
import { IFilter } from '../../interfaces/i-filter';
import { TFilters } from '../../types/t-filters';

@Component({
  selector: 'app-values-list',
  imports: [IconLens, IconCheck],
  templateUrl: './values-list.html',
  styleUrl: './values-list.css',
})
export class ValuesList {
  filtersService = inject(FiltersService);

  field: InputSignal<string> = input('');

  notInValuesList: WritableSignal<any[]> = signal([]);
  search: WritableSignal<string> = signal('');

  ngOnInit() {
    this.notInValuesList.set(this.filtersService.internalFilters()?.[this.field()]?.notIn || []);
  }

  onClick(value: any) {
    let notInValuesList: any[] = [...this.notInValuesList()];

    if (notInValuesList.includes(value)) {
      notInValuesList = notInValuesList.filter((v) => v !== value);
    } else {
      notInValuesList.push(value);
    }
    this.notInValuesList.set(notInValuesList);
  }

  onCancel() {
    this.notInValuesList.set(this.filtersService.internalFilters()?.[this.field()]?.notIn || []);
  }

  onSave() {
    const internalFilters: TFilters = { ...this.filtersService.internalFilters() };
    const filter: IFilter | undefined = internalFilters[this.field()];

    if (!filter) {
      internalFilters[this.field()] = {};
    }

    internalFilters[this.field()].notIn = this.notInValuesList();
    this.filtersService.internalFilters.set(internalFilters);
  }
}

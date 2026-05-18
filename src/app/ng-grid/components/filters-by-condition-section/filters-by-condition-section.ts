import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FiltersService } from '../../services/filters-service';
import { TFilters } from '../../types/t-filters';
import { IFilter } from '../../interfaces/i-filter';

@Component({
  selector: 'app-filters-by-condition-section',
  imports: [],
  templateUrl: './filters-by-condition-section.html',
  styleUrl: './filters-by-condition-section.css',
})
export class FiltersByConditionSection {
  filtersService = inject(FiltersService);

  field: InputSignal<string> = input('');
  fieldType: InputSignal<string> = input('');

  selectedOption: WritableSignal<string | null> = signal(null);
  showFilterByConditionSubmenu: WritableSignal<boolean> = signal(false);
  value: WritableSignal<string> = signal('');
  betweenValues: WritableSignal<
    { lowerBound: number; upperBound: number } | { lowerBound: string; upperBound: string } | null
  > = signal(null);

  optionsKeys: Signal<string[]> = computed(() => Object.keys(this.options));

  stringOptions: string[] = [
    'equalsTo',
    'doesNotEqualsTo',
    'startsWith',
    'doesNotStartWith',
    'endsWith',
    'doesNotEndWith',
    'contains',
    'doesNotContain',
    'isEmpty',
    'isNotEmpty',
    'isNull',
    'isNotNull',
  ];
  numberDateDateTimeOptions: string[] = [
    'equalsTo',
    'doesNotEqualsTo',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqualTo',
    'lessThanOrEqualTo',
    'isBetween',
    'isNotBetween',
    'isNull',
    'isNotNull',
  ];
  options: Record<string, string> = {
    equalsTo: 'Es igual a',
    doesNotEqualsTo: 'No es igual a',
    startsWith: 'Empieza por',
    doesNotStartWith: 'No empieza por',
    endsWith: 'Termina por',
    doesNotEndWith: 'No termina por',
    contains: 'Contiene',
    doesNotContain: 'No contiene',
    isEmpty: 'Está vacío',
    isNotEmpty: 'No está vacío',
    greaterThan: 'Es mayor que',
    lessThan: 'Es menor que',
    greaterThanOrEqualTo: 'Es mayor o igual a',
    lessThanOrEqualTo: 'Es menor o igual a',
    isBetween: 'Está entre',
    isNotBetween: 'No está entre',
    isNull: 'Es nulo',
    isNotNull: 'No es nulo',
  };

  ngOnInit() {
    const filter: IFilter | undefined = this.filtersService.internalFilters()[this.field()];

    if (!filter) return;

    const selectedOption: string | null =
      Object.keys(filter).find((key) => filter[key as keyof IFilter] !== 'notIn') || null;

    this.selectedOption.set(selectedOption);

    if (!selectedOption) return;

    if (selectedOption === 'isBetween' || selectedOption === 'isNotBetween') {
      this.betweenValues.set(filter[selectedOption as keyof IFilter] as any);
      return;
    }

    this.value.set(filter[selectedOption as keyof IFilter]);
  }

  onCancel() {
    const internalFilters: TFilters = { ...this.filtersService.internalFilters() };
    let field: IFilter = this.filtersService.internalFilters()[this.field()];

    if (field?.notIn) {
      field = { notIn: field.notIn };
    } else {
      field = {};
    }

    internalFilters[this.field()] = field;
    this.filtersService.internalFilters.set(internalFilters);
    this.selectedOption.set(null);
    this.value.set('');
    this.betweenValues.set(null);
  }

  onSave() {
    const selectedOption = this.selectedOption();

    if (!selectedOption) return;

    const requiresValue = !['isEmpty', 'isNotEmpty', 'isNull', 'isNotNull'].includes(
      selectedOption,
    );
    const requiresBetween = selectedOption === 'isBetween' || selectedOption === 'isNotBetween';

    if (requiresBetween) {
      const values = this.betweenValues();
      if (!values?.lowerBound || !values?.upperBound) return;
    } else if (requiresValue) {
      if (!this.value().trim()) return;
    }

    const internalFilters: TFilters = { ...this.filtersService.internalFilters() };
    let field: IFilter = this.filtersService.internalFilters()[this.field()];

    if (field?.notIn) {
      field = { notIn: field.notIn };
    } else {
      field = {};
    }

    if (['isEmpty', 'isNotEmpty', 'isNull', 'isNotNull'].includes(this.selectedOption()!)) {
      field[this.selectedOption() as 'isEmpty' | 'isNotEmpty' | 'isNull' | 'isNotNull'] = true;
    } else if (this.selectedOption() === 'isBetween' || this.selectedOption() === 'isNotBetween') {
      const isNumber = this.fieldType() === 'number';
      const values = this.betweenValues();
      field[this.selectedOption() as 'isBetween' | 'isNotBetween'] = isNumber
        ? { lowerBound: Number(values?.lowerBound), upperBound: Number(values?.upperBound) }
        : {
            lowerBound: String(values?.lowerBound ?? ''),
            upperBound: String(values?.upperBound ?? ''),
          };
    } else if (
      this.fieldType() === 'number' ||
      this.fieldType() === 'date' ||
      this.fieldType() === 'date-time'
    ) {
      field[
        this.selectedOption() as
          | 'equalsTo'
          | 'doesNotEqualsTo'
          | 'greaterThan'
          | 'lessThan'
          | 'greaterThanOrEqualTo'
          | 'lessThanOrEqualTo'
      ] = this.fieldType() === 'number' ? Number(this.value()) : this.value();
    } else {
      field[
        this.selectedOption() as
          | 'equalsTo'
          | 'doesNotEqualsTo'
          | 'startsWith'
          | 'doesNotStartWith'
          | 'endsWith'
          | 'doesNotEndWith'
          | 'contains'
          | 'doesNotContain'
      ] = this.value();
    }

    internalFilters[this.field()] = field;
    this.filtersService.internalFilters.set(internalFilters);
  }
}

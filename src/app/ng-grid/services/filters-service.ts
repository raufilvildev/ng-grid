import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TFilters } from '../types/t-filters';
import { PageService } from './page-service';

@Injectable()
export class FiltersService {
  constructor() {
    effect(() => {
      this.internalFilters();
      this.pageService.internalPage.set(1);
    });
  }

  pageService = inject(PageService);

  internalFilters: WritableSignal<TFilters> = signal({});
  internalValues: WritableSignal<{ [key: string]: any[] }> = signal({});
}

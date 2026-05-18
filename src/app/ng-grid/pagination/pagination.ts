import { Component, computed, inject, input, output, Signal } from '@angular/core';
import { IPaginationData } from '../interfaces/i-pagination-data';
import { IconLeftHeadArrow } from '../icons/icon-left-head-arrow/icon-left-head-arrow';
import { IconRightHeadArrow } from '../icons/icon-right-head-arrow/icon-right-head-arrow';
import { PageService } from '../services/page-service';

@Component({
  selector: 'app-pagination',
  imports: [IconLeftHeadArrow, IconRightHeadArrow],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  pageService = inject(PageService);

  paginationData = input<IPaginationData>({
    totalNumberOfRows: 0,
    totalNumberOfFilteredRows: 0,
    numberOfResultsPerPage: 0,
  });

  startIndexResult: Signal<number> = computed(() => {
    const totalNumberOfFilteredRows: number = this.paginationData().totalNumberOfFilteredRows;
    const numberOfResultsPerPage: number = this.paginationData().numberOfResultsPerPage;
    const page: number = this.pageService.internalPage();

    return !totalNumberOfFilteredRows ? 0 : (page - 1) * numberOfResultsPerPage + 1;
  });
  endIndexResult: Signal<number> = computed(() => {
    const totalNumberOfFilteredRows: number = this.paginationData().totalNumberOfFilteredRows;
    const numberOfResultsPerPage: number = this.paginationData().numberOfResultsPerPage;
    const page: number = this.pageService.internalPage();

    return Math.min(page * numberOfResultsPerPage, totalNumberOfFilteredRows);
  });

  totalPages: Signal<number> = computed(() => {
    const totalNumberOfFilteredRows: number = this.paginationData().totalNumberOfFilteredRows;
    const numberOfResultsPerPage: number = this.paginationData().numberOfResultsPerPage;

    return Math.floor(totalNumberOfFilteredRows / numberOfResultsPerPage) + 1;
  });

  onPrev() {
    const startIndexResult: number = this.startIndexResult();
    const page: number = this.pageService.internalPage();

    if (startIndexResult > 0 && page > 1) {
      this.pageService.internalPage.set(page - 1);
    }
  }

  onNext() {
    const page: number = this.pageService.internalPage();
    const totalPages: number = this.totalPages();
    if (page > 0 && page < totalPages) {
      this.pageService.internalPage.set(page + 1);
    }
  }
}

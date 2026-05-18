import { Directive, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[appHorizontalScrollDragging]',
  exportAs: 'horizontalScrollDragging',
})
export class HorizontalScrollDragging {
  tableContainer: InputSignal<HTMLElement> = input.required();

  edgeThreshold: number = 75;
  scrollSpeed: number = 50;

  handleHorizontalScroll = (mouseX: number) => {
    const tableContainer: HTMLElement = this.tableContainer();
    const rect: DOMRect = tableContainer.getBoundingClientRect();

    if (mouseX >= rect.right - this.edgeThreshold) {
      const distanceToEdge: number = rect.right - mouseX;
      const intensity: number = (this.edgeThreshold - distanceToEdge) / this.edgeThreshold;
      tableContainer.scrollLeft += this.scrollSpeed * intensity;
    } else if (mouseX <= rect.left + this.edgeThreshold) {
      const distanceToEdge: number = mouseX - rect.left;
      const intensity: number = (this.edgeThreshold - distanceToEdge) / this.edgeThreshold;
      tableContainer.scrollLeft -= this.scrollSpeed * intensity;
    }
  };
}

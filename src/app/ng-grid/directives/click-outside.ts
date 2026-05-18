import { Directive, ElementRef, output, OutputEmitterRef } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onClick($event)',
    '(document:mousedown)': 'onClick($event)',
  },
})
export class ClickOutside {
  constructor(private elementRef: ElementRef) {}

  clickOutside: OutputEmitterRef<void> = output();

  onClick(event: MouseEvent): void {
    const clickedInside: boolean = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}

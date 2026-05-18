import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable()
export class PageService {
  internalPage: WritableSignal<number> = signal(1);
}

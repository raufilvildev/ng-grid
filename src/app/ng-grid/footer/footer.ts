import { Component, inject, input, InputSignal } from '@angular/core';
import { IColDef } from '../interfaces/i-col-def';
import { ColumnsService } from '../services/columns-service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  columnsService = inject(ColumnsService);
  footer: InputSignal<any> = input.required();
}

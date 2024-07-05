import { Component } from '@angular/core';

import { CoffeeInputComponent } from '../coffee-input/coffee-input.component';

@Component({
  selector: 'mcf-coffee-overview',
  standalone: true,
  imports: [CoffeeInputComponent],
  templateUrl: './coffee-overview.component.html',
  styleUrl: './coffee-overview.component.css',
})
export class CoffeeOverviewComponent {
  protected amount = 0;
}

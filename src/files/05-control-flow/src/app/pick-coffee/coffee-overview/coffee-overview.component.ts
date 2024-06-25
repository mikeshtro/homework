import { Component } from '@angular/core';

@Component({
  selector: 'mcf-coffee-overview',
  standalone: true,
  imports: [],
  templateUrl: './coffee-overview.component.html',
  styleUrl: './coffee-overview.component.css',
})
export class CoffeeOverviewComponent {
  protected amount = 0;

  protected orderCoffee(): void {
    this.amount += 1;
  }
}

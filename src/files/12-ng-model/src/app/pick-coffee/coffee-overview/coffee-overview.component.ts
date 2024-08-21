import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { CoffeeInputComponent } from '../coffee-input/coffee-input.component';

@Component({
  selector: 'mcf-coffee-overview',
  standalone: true,
  imports: [DecimalPipe, CoffeeInputComponent],
  templateUrl: './coffee-overview.component.html',
  styleUrl: './coffee-overview.component.css',
})
export class CoffeeOverviewComponent implements OnChanges {
  @Input() amount: number | undefined;
  @Input() price: number | undefined;

  @Output() amountChange = new EventEmitter<number>();

  protected computedPrice = 0;

  ngOnChanges(): void {
    this.computedPrice = this.getPrice();
  }

  protected orderCoffee(value: number): void {
    this.amountChange.emit(value);
  }

  private getPrice(): number {
    const price = this.price;
    const amount = this.amount;

    if (price == null || amount == null) {
      return 0;
    }

    return price * amount;
  }
}

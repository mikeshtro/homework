import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mcf-coffee-input',
  standalone: true,
  imports: [],
  templateUrl: './coffee-input.component.html',
  styleUrl: './coffee-input.component.css',
})
export class CoffeeInputComponent {
  @Input() value: number | undefined;

  @Output() valueChange = new EventEmitter<number>();

  protected orderCoffee(): void {
    this.valueChange.emit((this.value ?? 0) + 1);
  }
}

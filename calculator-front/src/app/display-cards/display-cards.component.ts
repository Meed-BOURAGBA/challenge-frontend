import { Component, Input, OnInit } from '@angular/core';
import { CalculatorComponentValue } from '../model/calculator.-component-value.model';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.scss']
})
export class DisplayCardsComponent implements OnInit {

  @Input() calculatorComponentValue: CalculatorComponentValue | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

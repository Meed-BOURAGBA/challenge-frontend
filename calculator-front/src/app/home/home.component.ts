import { Component, OnInit } from '@angular/core';
import { CalculatorComponentValue } from '../model/calculator.-component-value.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  calculatorComponentValue: CalculatorComponentValue | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  setCalculatorComponentValue(value: CalculatorComponentValue) {
    this.calculatorComponentValue = value;
  }
}

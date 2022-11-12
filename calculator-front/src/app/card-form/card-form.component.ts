import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardService } from '../services/card.service';
import { CalculatorComponentValue } from '../model/calculator.-component-value.model';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

  form!: FormGroup;
  desiredAmount: number | undefined;
  calculatorComponentValue: CalculatorComponentValue | undefined;

  private subscriptionsOnDestroy: Subscription[] = [];

  @Output() calculatorComponentValueEmit = new EventEmitter<CalculatorComponentValue>();

  constructor(private cardService: CardService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      desiredAmount: new FormControl(this.desiredAmount != null ? this.desiredAmount : null, [Validators.required, Validators.pattern("^[0-9]*$")] )
    });
  }

  getDesiredAmount(): number {
    return this.form.get('desiredAmount')?.value;
  }

  clearDesiredAmount() {
    this.form.controls['desiredAmount'].setValue(null);
  }

  /**
   * VALIDER
   */
   onClickValider() {
    this.initCalculatorComponentValue(); 
    this.subscriptionsOnDestroy.push(this.cardService.getCards(this.getDesiredAmount()).subscribe(result => {
      const obj = JSON.parse(result);
      if(obj.equal && this.calculatorComponentValue!= null) {
        this.calculatorComponentValue.cards = obj.equal.cards;
      } else if(!obj.equal && obj.ceil && this.calculatorComponentValue!= null) {
        this.calculatorComponentValue.cards = obj.ceil.cards;
      }
      this.calculatorComponentValueEmit.emit(this.calculatorComponentValue);
    }));
  }

  /**
   * MONTANTPRECEDENT
   */
  onClickMonatntPrecedent() {
    this.initCalculatorComponentValue(); 
    this.subscriptionsOnDestroy.push(this.cardService.getCards(this.getDesiredAmount()).subscribe(result => {
      const obj = JSON.parse(result);
      if(obj.floor && this.calculatorComponentValue!= null) {
        this.calculatorComponentValue.cards = obj.floor.cards;
      } 
      this.calculatorComponentValueEmit.emit(this.calculatorComponentValue);
    }));
  }

  /**
   * MONTANT SUIVANT
   */
  onClickMontantSuivant() {
    this.initCalculatorComponentValue(); 
    this.subscriptionsOnDestroy.push(this.cardService.getCards(this.getDesiredAmount()).subscribe(result => {
      const obj = JSON.parse(result);
      if(obj.ceil && this.calculatorComponentValue!= null) {
        this.calculatorComponentValue.cards = obj.ceil.cards;
      } 
      this.calculatorComponentValueEmit.emit(this.calculatorComponentValue);
    }));
  }

  /**
   * init variable
   */
  initCalculatorComponentValue() {
    this.calculatorComponentValue = {
      value: this.getDesiredAmount(),
      cards: []
    }
  }

  ngOnDestroy(): void {
    this.subscriptionsOnDestroy.forEach(subscription => subscription.unsubscribe());
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardService } from '../services/card.service';
import { CalculatorComponentValue } from '../model/calculator.-component-value.model';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

  @Output() calculatorComponentValueEmit = new EventEmitter<CalculatorComponentValue>();


  form!: FormGroup;
  desiredAmount: number | undefined;
  calculatorComponentValue: CalculatorComponentValue | undefined;
  possibleAmounts: number[] = [];
  submitted = false;
  subscriptionsOnDestroy: Subscription[] = [];

  constructor(private cardService: CardService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      desiredAmount: new FormControl(this.desiredAmount != null ? this.desiredAmount : null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  getDesiredAmount(): number {
    return this.form.get('desiredAmount')?.value;
  }

  setDesiredAmount(mountant: number) {
    this.form.controls['desiredAmount'].setValue(mountant);
  }

  /**
   * VALIDER
   */
  onClickValider() {
    this.submitted = true
    if (this.isValidForm()) {
      this.checkEtape3Level1();
      this.initCalculatorComponentValue();
      this.subscriptionsOnDestroy.push(this.cardService.getCards(this.getDesiredAmount()).subscribe(result => {
        const obj = JSON.parse(result);
        if (obj.equal && this.calculatorComponentValue != null) {
          this.calculatorComponentValue.cards = obj.equal.cards;
        } else if (!obj.equal && this.calculatorComponentValue != null) {
          if (obj.ceil) {
            this.possibleAmounts.push(obj.ceil.value);
          }
          if (obj.floor) {
            this.possibleAmounts.push(obj.floor.value);
          }
          this.calculatorComponentValue.cards = [];
        }
        this.calculatorComponentValueEmit.emit(this.calculatorComponentValue);
      }));
    }
  }

  /**
   * MONTANTPRECEDENT
   */
  onClickMonatntPrecedent() {
    this.initCalculatorComponentValue();
    this.subscriptionsOnDestroy.push(this.cardService.getCards(this.getDesiredAmount()).subscribe(result => {
      const obj = JSON.parse(result);
      if (obj.floor && this.calculatorComponentValue != null) {
        this.calculatorComponentValue.cards = obj.floor.cards;
        this.setDesiredAmount(obj.ceil.value);
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
      if (obj.ceil && this.calculatorComponentValue != null) {
        this.calculatorComponentValue.cards = obj.ceil.cards;
        this.setDesiredAmount(obj.ceil.value);
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
    this.possibleAmounts = [];
  }

  isValidForm() {
    return this.getDesiredAmount() != null && this.getDesiredAmount().toString().trim().length != 0;
  }

  onChoisirMontant(montantChoisir: number) {
    this.setDesiredAmount(montantChoisir);
    this.onClickValider();
  }

  /**
   * to test this condition 
   * if the desired amount is higher or lower than the possible amounts, the component will auto-correct the user
     with the possible value (for example, the user ask for 5 €, the API will return that only 20 € is possible) and
     do the step #1 with the auto-corrected amount.
   */
  checkEtape3Level1() {
    if (this.possibleAmounts.length > 0 && this.getDesiredAmount() != null) {
      console.log(this.possibleAmounts.findIndex(element => element == this.getDesiredAmount()))
      if (this.possibleAmounts.findIndex(element => element == this.getDesiredAmount()) == -1) {
        this.setDesiredAmount(this.possibleAmounts[0]);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptionsOnDestroy.forEach(subscription => subscription.unsubscribe());
  }
}

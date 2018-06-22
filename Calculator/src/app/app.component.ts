import { Component } from '@angular/core';
import { DivideModel } from './model/divideModel';
import { MultiplyModel } from './model/multiplyModel';
import { MultiplyPowModel } from './model/multiplyPowModel';
import { EquationType } from './model/equationType';
import { Converter } from "./util/coverter.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public argument1: number;
  public pow1: number;
  public base1: number;

  public argument2: number;
  public pow2: number;
  public base2: number;

  constructor(public converter: Converter) {

  }

  public convertResult: number;
  public convertDecimalResult: number;
  //equation 
  public equationType: EquationType;
  public equationResult;
  public equationResultBase1;
  public equationResultBase2;

  public checkSystem(argument: number, base: number): boolean {
    var numStr: string = argument.toString();
    for (var index = 0; index < numStr.length; index++) {
      var digit = +numStr[index];
      if (!isNaN(digit) && digit >= base) {
        return false;
      }
    }
    return true;
  }

  public add() {
    this.clear();
    this.equationType = EquationType.ADD;
    this.count();
  }

  public substract() {
    this.clear();
    this.equationType = EquationType.SUBSTRACT;
    this.count();
  }

  public multiply() {
    this.clear();
    this.equationType = EquationType.MULTIPLY;
    this.count();
  }

  public divide() {
    this.clear();
    this.equationType = EquationType.DIVIDE;
    this.count();
  }

  public sign(): string {
    switch (this.equationType) {
      case EquationType.ADD:
        return "+";
      case EquationType.SUBSTRACT:
        return "-";
      case EquationType.MULTIPLY:
        return "*";
      case EquationType.DIVIDE:
        return "/";
    }
  }

  public convertToNewSystem() {
    this.clear();
    this.convertResult = this.converter.inNewSystem(this.converter.normalizeBack(this.argument1, 10, this.pow1), this.base1, false);
  }

  public convertToDecimalSystem() {
    this.clear();
    this.convertDecimalResult = this.converter.inDecimalSystem(this.converter.normalizeBack(this.argument1, this.base1, this.pow1), this.base1, false);
  }

  public count() {
    var argumentDecimal1 = this.converter.inDecimalSystem(this.converter.normalizeBack(this.argument1, this.base1, this.pow1), this.base1, true);
    var argumentDecimal2 = this.converter.inDecimalSystem(this.converter.normalizeBack(this.argument2, this.base2, this.pow2), this.base2, true);
    switch (this.equationType) {
      case EquationType.ADD:
        this.equationResult = argumentDecimal1 + argumentDecimal2;
        break;
      case EquationType.SUBSTRACT:
        this.equationResult = argumentDecimal1 - argumentDecimal2;
        break;
      case EquationType.MULTIPLY:
        this.equationResult = argumentDecimal1 * argumentDecimal2;
        break;
      case EquationType.DIVIDE:
        this.equationResult = argumentDecimal1 / argumentDecimal2;
        break;
    }
    this.equationResultBase1 = this.converter.inNewSystem(this.equationResult, this.base1, true);
    this.equationResultBase2 = this.converter.inNewSystem(this.equationResult, this.base2, true);
  }

  public clear() {
    this.converter.clear();
    this.equationType = null;
    this.equationResult = 0;
    this.equationResultBase1 = 0;
    this.equationResultBase2 = 0;
  }
}

import { Injectable } from '@angular/core';
import { MultiplyModel } from '../model/multiplyModel';
import { DivideModel } from '../model/divideModel';
import { MultiplyPowModel } from '../model/multiplyPowModel';
@Injectable()
export class Converter {

    //convert to system
    public divideModels: DivideModel[] = [];
    public multiplyModels: MultiplyModel[] = [];
    public totalNewSystem: number;
    public fractialNewSystem: number;


    //convert to decimal 
    public multiplyModelsTotal: MultiplyPowModel[] = [];
    public totalSum: number = 0;
    public multiplyModelsFractial: MultiplyPowModel[] = [];
    public fractialSum: number = 0;

    public inNewSystem(num: number, base: number, silentMode: boolean): number {
        var numAbs: number = Math.abs(num);
        var total = Math.trunc(numAbs);
        var fractial = this.round(numAbs - total);
        var totalNewSystemStr: string = "";
        var totalNewSystem;
        var fractialNewSystem;
        while (Math.abs(total) > 0) {
            var result = Math.trunc(total / base);
            var rest = total % base;
            if (!silentMode) {
                this.divideModels.push(new DivideModel(total, result, rest));
            }
            total = result;
            totalNewSystemStr = totalNewSystemStr.concat(rest.toString());
        }
        totalNewSystemStr = this.revert(totalNewSystemStr);
        totalNewSystem = + totalNewSystemStr;

        var fractialNewSystemStr: string = "0.";
        var i = 0;
        while (fractial !== 0 && i < 50) {
            var result = this.round(fractial * base);
            var t = Math.trunc(result);
            if (!silentMode) {
                this.multiplyModels.push(new MultiplyModel(fractial, result, t));
            }
            fractial = result;
            fractial = this.round(fractial - t);
            fractialNewSystemStr = fractialNewSystemStr.concat(t.toString());
            i++;
        }
        fractialNewSystem = + fractialNewSystemStr;

        if (!silentMode) {
            this.totalNewSystem = totalNewSystem;
            this.fractialNewSystem = fractialNewSystem;
        }

        return this.sumWithSign(totalNewSystem, fractialNewSystem, num < 0);
    }

    public inDecimalSystem(num: number, base: number, silentMode: boolean): number {
        var totalSum: number = 0;
        var fractialSum: number = 0;
        var numAbs: number = Math.abs(num);
        var total = Math.trunc(numAbs);
        var fractial = this.round(numAbs - total);
        var totalStr = this.revert(total.toString());
        var fractialStr = fractial.toString().replace("0.", "");
        for (var i = 0; i < totalStr.length; i++) {
            var digit: number = +totalStr[i];

            var result = digit * Math.pow(base, i);
            if (!silentMode) {
                this.multiplyModelsTotal.push(new MultiplyPowModel(digit, result, i));
            }
            totalSum += result;
        }

        for (var i = 0; i < fractialStr.length; i++) {
            var digit: number = +fractialStr[i];
            var pow = i * -1 - 1
            var result = digit * Math.pow(base, pow);
            if (!silentMode) {
                this.multiplyModelsFractial.push(new MultiplyPowModel(digit, result, pow));
            }
            fractialSum += result;
        }
        if (!silentMode) {
            this.totalSum = totalSum;
            this.fractialSum = fractialSum;
        }
        return this.sumWithSign(totalSum, fractialSum, num < 0);
    }

    public sumWithSign(num1: number, num2: number, negative: boolean) {
        var sum = num1 + num2;
        if (negative) {
            sum *= -1;
        }
        return sum;
    }

    public clear() {
        this.divideModels = []
        this.multiplyModels = []
        this.totalNewSystem = 0;
        this.fractialNewSystem = 0;

        this.totalSum = 0;
        this.multiplyModelsTotal = [];
        this.multiplyModelsFractial = [];
        this.fractialSum = 0;
    }


    private round(num: number): number {
        return +num.toFixed(9)
    }

    private revert(str: string): string {
        return str.split("").reverse().join("");
    }

    public normalizeBack(number: number, base: number, pow: number): number {
        return number * Math.pow(base, pow);
    }

    public normalize(number: number): string {
        if (number) {
            var str = number.toString();
            if (str.indexOf("e") !== -1)
                return number.toString();
            var negative: boolean = false;
            if (str[0] === "-") {
                str = str.substr(1, str.length);
                negative = true;
            }
            var indexOfDot = str.indexOf(".");
            if (indexOfDot < 0) {
                indexOfDot = str.length;
            }
            str = str.replace(".", "");
            while (str[0] === "0") {
                str = str.substr(1, str.length);
                indexOfDot--;
            }

            var base = str.substr(0, 1);
            var fractial = str.substr(1, str.length);
            if (negative) {
                base = "-" + base;
            }

            var pow = indexOfDot - 1;
            var result = base + "." + fractial;
            var resultNum = +result;
            if (pow != 0)
                return resultNum + "E" + pow;
            else {
                return resultNum.toString();
            }

        }
        return "";
    }
}
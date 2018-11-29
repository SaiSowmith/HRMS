import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})


export class DatePickerComponent implements ControlValueAccessor {

  @Input() _dateValue: string = null;
  @Input() public placeholder: string = null;
  @Input() private format = 'YYYY-MM-DD';

  get dateValue() {
    return moment(this._dateValue, this.format);
  }

  set dateValue(val) {
    this._dateValue = moment(val).format(this.format);
    this.propagateChange(this._dateValue);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateValue = moment(event.value, this.format);
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.dateValue = moment(value, this.format);
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }
}
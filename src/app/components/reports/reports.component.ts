import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveService } from './../../services/leave.service';
import { Reports } from './../../models/reports';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
})

export class ReportsComponent implements OnInit {

  formGroup: FormGroup;
  reports = new Reports();
  send: { "fromDate": Date; "toDate": Date; };
  result1: any = [];
  result2: any = [];
  lbsObj: any = [];
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    console.log("DAY", day)
    return day !== 0 && day !== 6;
  }


  constructor(
    private leaveService: LeaveService,
    private formBuilder: FormBuilder
  ) { }


  createForm() {
    this.formGroup = this.formBuilder.group({
      'fromDate': [null, Validators.required],
      'toDate': [null, Validators.required],
      'validate': ''
    });
  }

  onSubmit() {
    console.log("Date Submit", this.reports);
    this.send = {
      "fromDate": this.reports.fromDate,
      "toDate": this.reports.toDate
    }

    this.result1 = [];
    this.result2 = [];
    this.leaveService.getReport(this.reports.fromDate, this.reports.toDate)
      .subscribe(

        response => {

          Object.keys(response).forEach(key => {
            this.result1.push(response[key]);
          });

          console.log("REPORTS result1 ", this.result1);

          const list = {};
          this.result1.forEach((emp, index) => {
            if (emp.Status == "Approved") {

              if (!list[emp.EmpId]) {
                list[emp.EmpId] = {
                  'EmpId': emp.EmpId,
                  'EmpName': emp.EmpName,
                  'TotalDays': emp.TotalDays,
                }

              } else {
                list[emp.EmpId].TotalDays += emp.TotalDays;
              }

            }
          });

          console.log("list total = ", list)

          for (const i in list) {
            console.log("ID= ", list[i].EmpId);
            this.leaveService.getLbsData(list[i].EmpId)
              .subscribe(
                response => {

                  Object.keys(response).forEach(key => {

                    console.log("Employee data before add list[i] ", list[i])

                    this.lbsObj = response[key];
                    console.log("lbsObj", this.lbsObj);
                    list[i].CL = this.lbsObj.CL;
                    list[i].EL = this.lbsObj.EL;
                    this.result2.push(list[i]);

                    console.log("Employee data after add,result2", this.result2);

                  });

                })
          }

        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }
  }

  ngOnInit() {
    this.createForm();
  }

}

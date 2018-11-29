import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Reports } from './../../models/reports';
import { LeaveService } from './../../services/leave.service';
import * as moment from 'moment';


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
  submitDate: { "fromDate": Date; "toDate": Date; };
  reportData: any = [];
  reportsDataList: any = [];

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

    this.submitDate = {
      "fromDate": this.reports.fromDate,
      "toDate": this.reports.toDate
    }

    this.reportData = [];
    this.reportsDataList = [];
    this.leaveService.getReport(this.reports.fromDate, this.reports.toDate)
      .subscribe(

        response => {
          Object.keys(response).forEach(key => {
            this.reportData.push(response[key]);
          });

          console.log("REPORTS reportData ", this.reportData);
          //ADMIN
          if (localStorage.getItem("Role") == "Admin") {
            const list = {};
            this.reportData.forEach((emp, index) => {
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

            console.log("list total in admin = ", list)
            for (const i in list) {
              this.reportsDataList.push(list[i]);
            }
            console.log("reportsDataList = ", this.reportsDataList);
          }

          //MANAGER
          if (localStorage.getItem("Role") == "Manager") {
            const list = {};

            this.reportData.forEach((emp, index) => {
              if (emp.Status == "Approved" && emp.RMID == localStorage.getItem("EmpId")) {

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

            console.log("list total in Manager = ", list);
            for (const i in list) {
              this.reportsDataList.push(list[i]);
            }
            console.log("reportsDataList = ", this.reportsDataList);
          }


          //EMPLOYEE
          if (localStorage.getItem("Role") == "Employee") {
            const list = {};

            this.reportData.forEach((emp, index) => {
              if (emp.Status == "Approved" && emp.EmpId == localStorage.getItem("EmpId")) {

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

            console.log("list total in employee= ", list)
            for (const i in list) {
              this.reportsDataList.push(list[i]);
            }
            console.log("reportsDataList = ", this.reportsDataList);

          }

        })
  }


  ngOnInit() {
    this.createForm();
  }

}
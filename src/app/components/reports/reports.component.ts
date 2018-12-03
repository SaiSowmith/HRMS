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
  finaldate1: any;
  finaldate2: any;
  
  minDate = new Date();
  maxDate = new Date(2020, 0, 1);
  // myFilter = (d: Date): boolean => {
  //   const day = d.getDay();
  //   console.log("DAY", day)
  //   return day !== 0 && day !== 6;
  // }


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

    var a = this.reports.fromDate.toString();
    console.log("a",a);
    var date1 = moment(new Date(a.substr(0, 16)));
    this.finaldate1=date1.format("YYYY-MM-DD");
    console.log("finalDate1",this.finaldate1);

    var b = this.reports.toDate.toString();
    console.log("b",b);
    var date2 = moment(new Date(b.substr(0, 16)));
    this.finaldate2=date2.format("YYYY-MM-DD");
    console.log("finalDate2",this.finaldate2);
    // var ds = "Mon Dec 10 2018 00:00:00 GMT+0530 (India Standard Time)";
    // var date = moment(new Date(ds.substr(0, 16)));
    // console.log(date.format("YYYY-MM-DD"));

    this.reportData = [];
    this.reportsDataList = [];
    this.leaveService.getReport(this.finaldate1,this.finaldate2)
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
    var ds = "Mon Dec 10 2018 00:00:00 GMT+0530 (India Standard Time)";
    var date = moment(new Date(ds.substr(0, 16)));
    console.log("Test",date.format("YYYY-MM-DD"));
  }

}
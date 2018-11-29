import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { Leave } from 'src/app/models/leave';
import { LeaveService } from 'src/app/services/leave.service';
import { LoginService } from 'src/app/services/login.service';
import { DialogData } from 'src/app/models/test';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})


export class LeaveComponent implements OnInit {

  EmpId: any;
  EmpName: any;
  EMail: any;
  EmpDOJ: any;

  leave = new Leave();

  leavesHistoryArray: any = [];
  lbsData: any = [];
  lbsUpdateData: any;
  cancelRequestLbsData: any = [];

  leavesDocumentIdArray: any = [];
  leaveType: String;
  keyId: string;
  lbsObj: any = [];
  lbsDocumentId: any;
  lbsUpdateObj: any;

  dataSource;
  ELEMENT_DATA = [];
  displayedColumns: string[] = ['fromdate', 'todate', 'totalleaves', 'typeofleave', 'reasonforleave', 'status', 'action'];

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }


  constructor(
    private loginService: LoginService,
    private router: Router,
    private leaveService: LeaveService,
    public dialog: MatDialog,
    public toastr: ToastrService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  openDialog(): void {
    const dialogRef = this.dialog.open(ApplyLeave, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {


      console.log('The dialog was closed');

      this.loadLBSData(localStorage.getItem("EmpId"));
      this.loadAppliedLeavesData(localStorage.getItem("EmpId"));

      this.router.navigate(['admin/leaves']);

    });
  }


  ngOnInit() {
    this.EmpId = localStorage.getItem("EmpId")

    this.loadAppliedLeavesData(this.EmpId);
    this.loadLBSData(this.EmpId);
  }

  loadAppliedLeavesData(empId) {

    this.leavesHistoryArray = [];
    this.dataSource = [];
    this.loginService.getLeave(empId)
      .subscribe(
        response => {
          if (response == null) {
            console.log("Given details not found");
          }
          else {

            var count = 0;
            Object.keys(response).forEach(key => {
              this.leavesDocumentIdArray.push(key);
              this.leavesHistoryArray.push(response[key]);
              this.ELEMENT_DATA = this.leavesHistoryArray;
              this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
              this.dataSource.paginator = this.paginator;

            });
            console.log("result 5 data = ", this.leavesHistoryArray);
          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }

  }

  cancelLeaveRequest(index) {
    let documentId = this.leavesDocumentIdArray[index];
    console.log("result while cancel data = ", this.leavesHistoryArray);
    let localResult = this.leavesHistoryArray;
    this.leaveService.cancelLeaveRequest(documentId).subscribe(response => {
      this.toastr.success("Leave cancelled  successfully ");
 this.sendEmailForCancelLeaveRequest();
      this.leaveService.getLbsData(this.EmpId)
        .subscribe(
          response => {

            Object.keys(response).forEach(key => {
              this.cancelRequestLbsData = response[key];
              console.log("LBS TEST Response ", response);
              console.log("LBS TEST Key ", key);
              console.log("LBS TEST cancelRequestLbsData ", this.cancelRequestLbsData);

              this.keyId = key;

            });

            this.lbsDocumentId = this.keyId;

            console.log("lbsDocID", this.lbsDocumentId)
            this.lbsObj = this.cancelRequestLbsData;
            console.log("Before  update leaves = " + this.lbsObj);
            console.log("leave Type form result5 ", localResult);

            console.log("leave Type for update balance ", localResult[index].LeaveType);
            if (localResult[index].LeaveType == "Earned Leave") {
              this.lbsObj.EL += localResult[index].TotalDays;
              this.lbsUpdateObj = {
                "EL": this.lbsObj.EL
              }

            } else if (localResult[index].LeaveType == "Casual Leave") {
              console.log("come to causual leave part");
              this.lbsObj.CL = this.lbsObj.CL + localResult[index].TotalDays;
              this.lbsUpdateObj = {
                "CL": this.lbsObj.CL

              }
            }
            console.log("after update leaves = " + this.lbsUpdateObj + "   document Id = " + this.lbsDocumentId);
            this.loginService.updateLBS(this.lbsDocumentId, this.lbsUpdateObj)
              .subscribe(
                res => {
                  this.lbsUpdateData = res;
                  console.log("UPDATE", res);

                  this.loadAppliedLeavesData(this.EmpId);

                  this.loadLBSData(this.EmpId);
                },
                err => {
                  console.log("ERROR!!!!", err);
                }
              );
          },
        ),

        err => {
          alert("ERROR!!! \n Check the Console")
          console.log("Error occured", err);
        }
    });
  }

  sendEmailForCancelLeaveRequest(){
    let email:any
    email={
      "rmID": localStorage.getItem("RMID"),
      "rmEmail": localStorage.getItem("RMEmail")
    }

    this.leaveService.sendEmailForCancelLeaveRequest(email).subscribe((data: any) => {
    },
      error => {
        console.log("Error in sendEmailForApplyLeave ", error);
      });
  }

  loadLBSData(empId) {
    this.loginService.getLBS(empId)
      .subscribe(
        response => {
          console.log("Response", response)
          if (response == null) {
            console.log("Given detailsnot found");
          }
          else {
            var count = 0;
            this.lbsData = [];
            Object.keys(response).forEach(key => {
              console.log("leaves balace after re load=== ", response[key]);
              this.lbsData.push(response[key]);
              console.log("leaves balace after  result === ", this.lbsData);
            });
            console.log("result after updates  == ", this.lbsData);
          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }
  }


  onSubmit() {
    console.log(this.leave)
  }

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];











import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'ApplyLeave',
  templateUrl: 'leave-apply.html',
})


export class ApplyLeave implements OnInit {

  formGroup: FormGroup;

  leave = new Leave();

  leaveTypes: string[] = [
    'Earned Leave', 'Casual Leave'];
  EmpName: string;
  applyLeaveObj: any;
  closeStatusFlag: boolean = false;

  minDate = new Date();
  maxDate = new Date(2020, 0, 1);
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<ApplyLeave>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  onNoClick(): void {
    this.closeStatusFlag = true;
    this.dialogRef.close();
  }


  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }


  createForm() {
    this.formGroup = this.formBuilder.group({
      'leaveType': [null, Validators.required],
      'fromDate': [null, Validators.required],
      'toDate': [null, Validators.required],
      'reason': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      'validate': ''
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('reason').setValidators([Validators.required, Validators.minLength(10)]);
        } else {
          this.formGroup.get('reason').setValidators(Validators.required);
        }
        this.formGroup.get('reason').updateValueAndValidity();
      }
    )
  }


  get name() {
    return this.formGroup.get('reason') as FormControl
  }


  checkInUseEmail(control) {
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }


  getErrorReason() {
    return this.formGroup.get('reason').hasError('required') ? 'This FIELD is required' :
      this.formGroup.get('reason').hasError('minlength') ? 'Min length shd be 2' : this.formGroup.get('reason').hasError('maxlength') ? 'Max Length shd be 150' : '';
  }


  onSubmit() {

    if (!this.closeStatusFlag) {
      console.log("Leave Submit", this.leave);
      var myDate = new Date(this.leave.fromDate.toString());
      console.log("myDate =  ", myDate);

      this.applyLeaveObj = {
        "StartDate": this.leave.fromDate,
        "RMID": localStorage.getItem("RMID"),
        "EndDate": this.leave.toDate,
        "ReasonForLeave": this.leave.reason,
        "TotalDays": this.leave.totalLeaves,
        "EmpName": localStorage.getItem("EmpName"),
        "Status": "Pending",
        "EmpId": localStorage.getItem("EmpId"),
        "LeaveType": this.leave.leaveType,
        "RMName": localStorage.getItem("RMName"),
        "Email": localStorage.getItem("EMail")
      }
      console.log("leave Type= ", this.leave.leaveType);

      this.leaveService.applyLeave(this.applyLeaveObj).subscribe((data: any) => {

        this.sendEmailForApplyLeave();
        console.log("before call  update balance --");

        this.updateLeaveBalance();
        this.toastr.success("Leave Applied successfully ");

      },
        error => {
          console.log("Error in onSubmit", error);
        });
    }
  }


  sendEmailForApplyLeave() {

    let email: any;
    email = {
      "startDate": this.leave.fromDate,
      "endDate": this.leave.toDate,
      "reasonForLeave": this.leave.reason,
      "noOfLeaves": this.leave.totalLeaves,
      "empName": localStorage.getItem("EmpName"),
      "status": "Pending",
      "empId": localStorage.getItem("EmpId"),
      "rmID": localStorage.getItem("RMID"),
      "rmName": localStorage.getItem("RMName"),
      "rmEmail": localStorage.getItem("RMEmail")
    }

    this.leaveService.sendEmailForApplyLeave(email).subscribe((data: any) => {
      // this.updateLeaveBalance();
    },
      error => {
        console.log("Error in sendEmailForApplyLeave ", error);
      });
  }




  getDays( dDate1, dDate2) {
    if(dDate1!=null){

      if(dDate2>=dDate1){
    var iWeeks, iDateDiff, iAdjust = 0;
    if (dDate2 < dDate1) return -1; // error code if dates transposed
    var iWeekday1 = dDate1.getDay(); // day of week
    var iWeekday2 = dDate2.getDay();
    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
    if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

    // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

    if (iWeekday1 <= iWeekday2) {
      iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    } else {
      iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }

    iDateDiff -= iAdjust // take into account both days on weekend
    let totalDays=(iDateDiff + 1);
    this.leave.totalLeavesCount="TotalLeaves : "+totalDays;
    this.leave.totalLeaves=totalDays;
    return totalDays; // add 1 because dates are inclusive
  }else{
    this.toastr.error("End Date Should be greater than Start Date ");

  }
  }
  }







  public updateLeaveBalance() {
    let lbsDocumentId: any;
    let lbsObj: any;
    let lbsUpdateObj: any;

    this.leaveService.getLbsData(localStorage.getItem("EmpId"))
      .subscribe(
        response => {

          Object.keys(response).forEach(key => {
            lbsDocumentId = key;
            lbsObj = response[key];
            console.log("LBS TEST Response ", response);
            console.log("LBS TEST Key ", key);
          });

          console.log("Leave type for leavebalance obj  == ", lbsObj);
          console.log("Leave type for leave balance update == ", this.leave.leaveType);

          if (this.leave.leaveType == "Earned Leave") {
            lbsObj.EL = lbsObj.EL - this.leave.totalLeaves;
            lbsUpdateObj = {
              "EL": lbsObj.EL
            }

          } else if (this.leave.leaveType == "Casual Leave") {
            lbsObj.CL = lbsObj.CL - this.leave.totalLeaves;
            lbsUpdateObj = {
              "CL": lbsObj.CL

            }
          }

          console.log("after update leaves = " + lbsUpdateObj);

          this.loginService.updateLBS(lbsDocumentId, lbsUpdateObj)
            .subscribe(
              res => {
                console.log("UPDATE", res);
                this.dialogRef.close();
              },
              err => {
                console.log("ERROR!!!!", err);
              }
            );
        },
      ),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }
  }

}
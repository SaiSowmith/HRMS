import { Component, OnInit, ViewChild } from '@angular/core';
import { Leave } from 'src/app/models/leave';
import { LeaveService } from 'src/app/services/leave.service';
import { LoginService } from 'src/app/services/login.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { DialogData } from 'src/app/models/test';
import { Inject } from '@angular/core';

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
  animal: string;
  name: string;
  leave = new Leave();
  minDate = new Date();
  maxDate = new Date(2020, 0, 1);
  results5: any = [];
  results3: any = [];
  statusMessage: string;
  leaveType: String;
  results6: any = [];
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  dataSource;
  ELEMENT_DATA = [];
  displayedColumns: string[] = ['fromdate', 'todate', 'totalleaves', 'typeofleave', 'reasonforleave', 'status'];


  constructor(private loginService: LoginService, private router: Router,
    private leaveService: LeaveService, public dialog: MatDialog) {


  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  openDialog(): void {

    const dialogRef = this.dialog.open(ApplyLeave, {
      width: '500px'
    });



    dialogRef.afterClosed().subscribe(result => {


      console.log('The dialog was closed');
      this.EmpId = localStorage.getItem("EmpId")

      this.loadLBSData(this.EmpId);
      this.loadAppliedLeavesData(this.EmpId);

      this.router.navigate(['admin/leaves']);

      this.animal = result;

    });
  }


  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    this.EmpId = localStorage.getItem("EmpId")

    this.loadAppliedLeavesData(this.EmpId);
    this.loadLBSData(this.EmpId);
  }
  loadAppliedLeavesData(empId) {
    this.results5 = [];
    this.loginService.getLeave(empId)
      .subscribe(
        response => {
          if (response == null) {
            this.statusMessage = " given details not found";
          }
          else {
            var count = 0;
            Object.keys(response).forEach(key => {

              this.results5.push(response[key]);
              this.ELEMENT_DATA = this.results5;
              this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
              this.dataSource.paginator = this.paginator;

            });
          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }

  }
  loadLBSData(empId) {
    this.loginService.getLBS(empId)
      .subscribe(
        response => {
          console.log("Response", response)
          if (response == null) {
            this.statusMessage = " given details not found";
          }
          else {
            var count = 0;
            this.results6 = [];
            Object.keys(response).forEach(key => {
              console.log("leaves balace after re load=== ", response[key]);
              this.results6.push(response[key]);
              console.log("leaves balace after  result === ", this.results6);



            });
            console.log("result == ", this.results6);
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


  // displayedColumns: string[] = ['from', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);



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
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ApplyLeave',
  templateUrl: 'leave-apply.html',
})

export class ApplyLeave implements OnInit {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  leave = new Leave();

  minDate = new Date();
  maxDate = new Date(2020, 0, 1);

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  leaveTypes: string[] = [
    'Earned Leave', 'Casual Leave'];
  EmpName: string;
  statusMessage: string;
  results5: Object;
  results3: any;
  applyLeave: any;
  results6: any = [];

  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    private router: Router,
    // private toastr: ToastrService,
    public dialogRef: MatDialogRef<ApplyLeave>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  send() {
  }
  ngOnInit() {


    this.createForm();
    this.setChangeValidate()
  }


  createForm() {
    //let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      // 'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      // 'name': [null, Validators.required],
      // 'password': [null, [Validators.required, this.checkPassword]],
      // 'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'leaveType': [null, Validators.required],
      'fromDate': [null, Validators.required],
      'toDate': [null, Validators.required],
      'reason': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      'totalLeaves': [null, Validators.required],
      'validate': ''
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('reason').setValidators([Validators.required, Validators.minLength(10)]);
          this.titleAlert = "You need to specify at least 10 characters";
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

  // checkPassword(control) {
  //   let enteredPassword = control.value
  //   let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  //   return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  // }

  checkInUseEmail(control) {
    // mimic http database access
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
      this.formGroup.get('reason').hasError('minlength') ? 'Min length shd be 5' : this.formGroup.get('reason').hasError('maxlength') ? 'Max Length shd be 50' : '';
  }
  onSubmit(post) {
    this.post = post;

    // alert("Thanks for submitting! Data: " + JSON.stringify(this.leave));
    console.log("Leave Submit", this.leave);
    var myDate = new Date(this.leave.fromDate.toString());
    console.log("myDate =  ", myDate);
    this.applyLeave = {
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
      //"LeaveType":this.leave.
    }
    console.log("leave Type= ", this.leave.leaveType);
    this.leaveService.applyLeave(this.applyLeave).subscribe((data: any) => {
      //if ( data.name === true) {
      //this.toastr.success(data.results);
      this.sendEmailForApplyLeave();
      console.log("before call  update balance --");

      this.updateLeaveBalance();




      //}
    },
      error => {
        //  this.toastr.warning(JSON.stringify(error.error.error));
      });


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


      //}
    },
      error => {
        //  this.toastr.warning(JSON.stringify(error.error.error));
      });

  }


  public updateLeaveBalance() {
    let lbsDocumentId: any;
    let lbsObj: any;
    let noOfLeaves: any;
    let lbsUpdate: any;
    let leaveType: any;

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
          if (this.leave.leaveType == "EL") {

            lbsObj.EL = lbsObj.EL - this.leave.totalLeaves;
            lbsUpdate = {
              "EL": lbsObj.EL
            }

          } else if (this.leave.leaveType == "CL") {
            lbsObj.CL = lbsObj.CL - this.leave.totalLeaves;
            lbsUpdate = {
              "CL": lbsObj.CL

            }
          }
          console.log("after update leaves = " + lbsUpdate);
          this.loginService.updateLBS(lbsDocumentId, lbsUpdate)
            .subscribe(
              res => {
                //this.results2 = res;
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

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/models/employees-applied-leaves';
import { Reject } from 'src/app/models/reject';
import { LeaveService } from 'src/app/services/leave.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { DialogData } from 'src/app/models/test';
import { Inject } from '@angular/core';

@Component({
  selector: 'employees-applied-leaves',
  templateUrl: './employees-applied-leaves.component.html',
  styleUrls: ['./employees-applied-leaves.component.scss']
})
export class EmployeesAppliedLeavesComponent implements OnInit {

  EmpId: any;
  EmpName: any;
  EMail: any;
  EmpDOJ: any;
  results5: any = [];
  results3: any = [];

  results1: any = [];
  results2: any = [];
  statusMessage: string;
  statusUpdate: any = {};
  test: any = {};

  selectedIndex: any;
  selectedEmployee: any = [];


  reject = new Reject();
  selectedEmpId: any;
  noOfLeaves: any;
  leaveType: any;

  constructor(
    private loginService: LoginService,
    private leaveService: LeaveService,
    private httpService: HttpClient,
    private router: Router,

    public dialog: MatDialog) {
  }
  dataSource;
  ELEMENT_DATA = [];
  displayedColumns: string[] = ['id', 'name', 'fromdate', 'todate', 'totalleaves', 'reason', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  saveIndex(data) {
    //  alert("index number = "+data+" data == "+this.results3);
    this.selectedIndex = this.results3[data];

    console.log("after assign= ", this.selectedIndex);
  }
  saveSelectedEmpId(id) {
    this.selectedEmployee = [];
    //  alert("index number = "+id+" data == "+this.results2);
    this.selectedEmpId = this.results5[id].EmpId;
    this.noOfLeaves = this.results5[id].TotalDays;
    this.leaveType = this.results5[id].LeaveType;
    this.selectedEmployee.push(this.results5[id]);
    //this.rmName=this.results5[id].RmName;
    //this.empName=this.results5[id].EmpName;
    //this.empEmail=this.results5[id].EmpEmail;
    //this.startDate=this.results5[id]
    //alert("selected before push== "+this.selectedEmployee[0].StartDate);
    //  alert("TEST "+this.results5[id].EmpId)
    console.log("selectedEmpId= ", this.selectedEmpId);

  }
  openDialog(): void {
    console.log("log for in dailog = " + this.selectedIndex);

    const dialogRef = this.dialog.open(RejectLeave, {
      width: '500px', data: { 'documentId': this.selectedIndex, 'selectedEmpId': this.selectedEmpId, 'noOfLeaves': this.noOfLeaves, 'leaveType': this.leaveType, 'selectedEmployee': this.selectedEmployee }
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getApprovalsList(this.EmpId);


    });
  }

  onSubmit() {
    // alert("Thanks for submitting! Data: " + JSON.stringify(this.reject));
    console.log(this.reject)
  }

  updateLeave(selectedIndex) {
    //  alert("index value= "+selectedIndex);
    //  alert("selected value= "+this.results3[selectedIndex]);
    this.statusUpdate = {
      "Status": "Approved",
      "RejectReason": ""

      // "StartDate":this.start

    }

    //this.loginService.u
    this.loginService.updateLeaves(this.results3[selectedIndex], this.statusUpdate);

    this.sendEmailForApprovedLeaves(selectedIndex);
    this.router.navigate(['admin/employees-applied-leaves']);



    // this.loginService.updateLBS(this.results3[data],this.test)


  }

  public sendEmailForApprovedLeaves(data) {


    let email: any;
    console.log(" index= " + data);
    //console.log("resulet 5   values= "+this.results5[0]);
    email = {
      "startDate": this.results5[data].StartDate,
      "endDate": this.results5[data].EndDate,
      "reasonForLeave": this.results5[data].reason,
      "noOfLeaves": this.results5[data].totalLeaves,
      "empName": this.results5[data].EmpName,
      "status": "Approved",
      "rmName": this.results5[data].RMName,
      "empEmail": this.results5[data].Email

    }
    console.log("email json =", email);

    this.leaveService.sendEmailForApprovedLeaves(email).subscribe((data: any) => {

      this.getApprovalsList(this.EmpId);

      //}
    },
      error => {
        //  this.toastr.warning(JSON.stringify(error.error.error));
      });
  }

  ngOnInit() {
    this.EmpId = localStorage.getItem("EmpId");
    this.EmpName = localStorage.getItem("EmpName");
    this.EMail = localStorage.getItem("EMail");
    this.EmpDOJ = localStorage.getItem("EmpDOJ");

    console.log("In Home", this.EmpId, this.EmpName, this.EMail, this.EmpDOJ)

    this.getApprovalsList(this.EmpId);


    this.EmpId = localStorage.getItem("EmpId");
    this.loginService.getLBS(this.EmpId)
      .subscribe(
        response => {
          if (response == null) {
            this.statusMessage = " given details not found";
          }
          else {
            var count = 0;
            Object.keys(response).forEach(key => {

              this.results1.push(response[key]);
              this.results2.push(key);

            });
            console.log("result LBS == ", this.results1);
            console.log("result keys LBS == ", this.results2);

          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }

  }

  getApprovalsList(empId) {
    this.results5 = [];
    this.loginService.getLeave2(this.EmpId)
      .subscribe(
        response => {
          if (response == null) {
            this.statusMessage = " given details not found";
          }
          else {
            var count = 0;
            Object.keys(response).forEach(key => {

              this.results5.push(response[key]);
              this.results3.push(key);

            });
            this.ELEMENT_DATA = this.results5;
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            console.log("result LMS == ", this.results5);
            console.log("result keys LMS == ", this.results3);

          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }


  }

}










import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from '@angular/core/src/render3/instructions';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'RejectLeave',
  templateUrl: 'leave-reject.html',
})

export class RejectLeave implements OnInit {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';
  results5: any;
  results3: any;
  applyLeave: any = {};

  reject = new Reject();
  documentId: any;
  selectedEmpId: any;
  noOfLeaves: any;
  leaveType: any;
  test2: any = {};
  results2: any;
  lbsUpdate: any;
  results11: any = [];
  lbsDocumentId: any;
  lbsObj: any = [];
  keyId: string;
  selectedEmployee: any[];
  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    private router: Router,
    // private toastr: ToastrService,
    public dialogRef: MatDialogRef<RejectLeave>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate();

    this.documentId = this.data.documentId;
    this.leaveType = this.data.leaveType;
    this.noOfLeaves = this.data.noOfLeaves;
    this.selectedEmpId = this.data.selectedEmpId;
    this.selectedEmployee = this.data.selectedEmployee;

    console.log("selected Employee== " + this.selectedEmployee[0].StartDate);


  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'reject': [null, Validators.required],
      'validate': ''
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('reject').setValidators([Validators.required, Validators.minLength(10)]);
          this.titleAlert = "You need to specify at least 10 characters";
        } else {
          this.formGroup.get('reject').setValidators(Validators.required);
        }
        this.formGroup.get('reject').updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.formGroup.get('reject') as FormControl
  }

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
    return this.formGroup.get('reject').hasError('required') ? 'Reason is required' :
      this.formGroup.get('reject').hasError('minlength') ? 'Min length shd be 5' : this.formGroup.get('reject').hasError('maxlength') ? 'Max Length shd be 50' : '';
  }
  onSubmit(post) {
    // alert("call submit for reject ");
    this.applyLeave = {
      "Status": "Rejected",
      "RejectReason": this.reject.reject,
    }
    console.log("before call reject call service === ", this.applyLeave);
    this.loginService.rejectLeaves(this.documentId, this.applyLeave).subscribe((data: any) => {
      //if status ==true

      this.sendEmailByRejectLeaves(this.selectedEmployee, this.reject.reject);
      this.leaveService.getLbsData(this.selectedEmpId)
        .subscribe(
          response => {

            Object.keys(response).forEach(key => {
              this.results11 = response[key];
              console.log("LBS TEST Response ", response);
              console.log("LBS TEST Key ", key);
              console.log("LBS TEST Results11 ", this.results11);

              // this.lbsDocumentId=this.result11;
              // this.lbsObj=result11[response];
              this.keyId = key;

            });
            this.lbsDocumentId = this.keyId;
            console.log("lbsDocID", this.lbsDocumentId)
            // this.lbsObj=result[response];
            this.lbsObj = this.results11;
            console.log("Before  update leaves = " + this.lbsObj);
            console.log("leave Type for update balance ", this.leaveType);
            if (this.leaveType == "Earned Leave") {
              this.lbsObj.EL += this.noOfLeaves;
              this.lbsUpdate = {
                "EL": this.lbsObj.EL
              }

            } else if (this.leaveType == "Casual Leave") {
              this.lbsObj.CL = this.lbsObj.CL + this.noOfLeaves;
              this.lbsUpdate = {
                "CL": this.lbsObj.CL

              }
            }
            console.log("after update leaves = " + this.lbsUpdate);
            this.loginService.updateLBS(this.lbsDocumentId, this.lbsUpdate)
              .subscribe(
                res => {
                  this.results2 = res;
                  console.log("UPDATE", res);
                  //   alert("Details have been updated Successfully! ")
                },
                err => {
                  // alert("Error Occured!!! \n Check the Console");
                  console.log("ERROR!!!!", err);
                }
              );
            
            this.router.navigate(['admin/employees-applied-leaves']);

          },

        ),
        err => {
          alert("ERROR!!! \n Check the Console")
          console.log("Error occured", err);
        }


      this.router.navigate(['admin/employees-applied-leaves']);
      this.dialogRef.close();


    });
  }
  sendEmailByRejectLeaves(selectedIndex, reason) {



    let email: any;

    email = {
      "startDate": this.selectedEmployee[0].StartDate,
      "endDate": this.selectedEmployee[0].EndDate,
      "reasonForLeave": this.selectedEmployee[0].reason,
      "noOfLeaves": this.selectedEmployee[0].totalLeaves,
      "empName": this.selectedEmployee[0].EmpName,
      "status": "Reject",
      "rmName": this.selectedEmployee[0].RMName,
      "empEmail": this.selectedEmployee[0].Email,
      "comments": reason
    }



    this.leaveService.sendEmailByRejectLeaves(email).subscribe((data: any) => {


      //}
    },
      error => {
        //  this.toastr.warning(JSON.stringify(error.error.error));
      });
  }
}
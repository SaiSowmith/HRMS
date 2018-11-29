import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoginService } from 'src/app/services/login.service';
import { LeaveService } from 'src/app/services/leave.service';
import { Reject } from 'src/app/models/reject';


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

  employeeLeaves: any = [];
  employeeLeavesList: any = [];

  lbsData: any = [];
  lbsDataKey: any = [];

  statusUpdate: any = {};
  selectedIndex: any;
  selectedEmployee: any = [];
  selectedEmpId: any;
  noOfLeaves: any;
  leaveType: any;

  reject = new Reject();

  dataSource;
  ELEMENT_DATA = [];
  displayedColumns: string[] = ['id', 'name', 'fromdate', 'todate', 'totalleaves', 'reason', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private router: Router,
    public dialog: MatDialog
  ) { }


  saveIndex(data) {
    this.selectedIndex = this.employeeLeavesList[data];
    console.log("after assign= ", this.selectedIndex);
  }


  saveSelectedEmpId(id) {
    this.selectedEmployee = [];
    this.selectedEmpId = this.employeeLeaves[id].EmpId;
    this.noOfLeaves = this.employeeLeaves[id].TotalDays;
    this.leaveType = this.employeeLeaves[id].LeaveType;
    this.selectedEmployee.push(this.employeeLeaves[id]);
    console.log("selectedEmpId= ", this.selectedEmpId);
  }


  openDialog(): void {
    console.log("log for in dailog = " + this.selectedIndex);
    const dialogRef = this.dialog.open(RejectLeave, {
      width: '500px', data: {
        'documentId': this.selectedIndex,
        'selectedEmpId': this.selectedEmpId,
        'noOfLeaves': this.noOfLeaves,
        'leaveType': this.leaveType,
        'selectedEmployee': this.selectedEmployee
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getApprovalsList(this.EmpId);
    });
  }


  onSubmit() {
    console.log(this.reject)
  }


  updateLeave(selectedIndex) {

    this.statusUpdate = {
      "Status": "Approved",
      "RejectReason": ""
    }

    this.loginService.updateLeaves(this.employeeLeavesList[selectedIndex], this.statusUpdate);
    this.sendEmailForApprovedLeaves(selectedIndex);
    this.router.navigate(['admin/employees-applied-leaves']);
  }


  public sendEmailForApprovedLeaves(data) {

    let email: any;
    console.log(" index= " + data);

    email = {
      "startDate": this.employeeLeaves[data].StartDate,
      "endDate": this.employeeLeaves[data].EndDate,
      "reasonForLeave": this.employeeLeaves[data].reason,
      "noOfLeaves": this.employeeLeaves[data].totalLeaves,
      "empName": this.employeeLeaves[data].EmpName,
      "status": "Approved",
      "rmName": this.employeeLeaves[data].RMName,
      "empEmail": this.employeeLeaves[data].Email
    }
    console.log("email json =", email);

    this.leaveService.sendEmailForApprovedLeaves(email).subscribe((data: any) => {
      this.getApprovalsList(this.EmpId);
    },
      error => {
        console.log("ERROR in sendEmailForApprovedLeaves ", error)
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
            console.log("Given Details Not Found1");
          }
          else {
            var count = 0;
            Object.keys(response).forEach(key => {

              this.lbsData.push(response[key]);
              this.lbsDataKey.push(key);

            });
            console.log("result LBS == ", this.lbsData);
            console.log("result keys LBS == ", this.lbsDataKey);

          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }

  }

  getApprovalsList(empId) {
    this.employeeLeaves = [];

    this.loginService.getLeave2(this.EmpId)
      .subscribe(
        response => {
          if (response == null) {
            console.log("Given Details Not Found1");
          }
          else {
            var count = 0;
            Object.keys(response).forEach(key => {

              this.employeeLeaves.push(response[key]);
              this.employeeLeavesList.push(key);

            });
            this.ELEMENT_DATA = this.employeeLeaves;
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            console.log("result LMS == ", this.employeeLeaves);
            console.log("result keys LMS == ", this.employeeLeavesList);

          }
        }),

      err => {
        alert("ERROR!!! \n Check the Console")
        console.log("Error occured", err);
      }
  }

}







import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'RejectLeave',
  templateUrl: 'leave-reject.html',
})


export class RejectLeave implements OnInit {

  formGroup: FormGroup;
  rejectObj: any = {};
  reject = new Reject();
  documentId: any;
  selectedEmpId: any;
  noOfLeaves: any;
  leaveType: any;
  lbsUpdateObj: any;
  updateLeavesByReject: any = [];
  lbsDocumentId: any;
  lbsObj: any = [];
  keyId: string;
  selectedEmployee: any[];

  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<RejectLeave>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


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


  onSubmit() {

    this.rejectObj = {
      "Status": "Rejected",
      "RejectReason": this.reject.reject,
    }

    console.log("before call reject call service === ", this.rejectObj);
    this.loginService.rejectLeaves(this.documentId, this.rejectObj).subscribe((data: any) => {

      this.sendEmailByRejectLeaves(this.selectedEmployee, this.reject.reject);
      this.leaveService.getLbsData(this.selectedEmpId)
        .subscribe(
          response => {

            Object.keys(response).forEach(key => {
              this.updateLeavesByReject = response[key];
              console.log("LBS TEST Response ", response);
              console.log("LBS TEST Key ", key);
              console.log("LBS TEST updateLeavesByReject ", this.updateLeavesByReject);
              this.keyId = key;
            });

            this.lbsDocumentId = this.keyId;
            console.log("lbsDocID", this.lbsDocumentId)
            this.lbsObj = this.updateLeavesByReject;
            console.log("Before  update leaves = " + this.lbsObj);
            console.log("leave Type for update balance ", this.leaveType);

            if (this.leaveType == "Earned Leave") {
              this.lbsObj.EL += this.noOfLeaves;
              this.lbsUpdateObj = {
                "EL": this.lbsObj.EL
              }


            } else if (this.leaveType == "Casual Leave") {
              this.lbsObj.CL = this.lbsObj.CL + this.noOfLeaves;
              this.lbsUpdateObj = {
                "CL": this.lbsObj.CL

              }
            }
            console.log("after update leaves = " + this.lbsUpdateObj);
            this.loginService.updateLBS(this.lbsDocumentId, this.lbsUpdateObj)
              .subscribe(
                res => {
                  console.log("UPDATE", res);
                },
                err => {
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
    },
      error => {
        console.log("Error in sendEmailByRejectLeaves ", error);
      });
  }

}
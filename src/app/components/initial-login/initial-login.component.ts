import { Component, OnInit } from '@angular/core';
import { InitLogin } from 'src/app/models/init-login';
import { LoginService } from 'src/app/services/login.service';
import { LeaveService } from 'src/app/services/leave.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/models/test';
import { Inject } from '@angular/core';

@Component({
  selector: 'initial-login',
  templateUrl: './initial-login.component.html',
  styleUrls: ['./initial-login.component.scss']
})

export class InitialLoginComponent implements OnInit {
  EmpId: any;
  EmpName: any;
  EMail: any;
  EmpDOJ: any;

  initLogin = new InitLogin();

  minDate = new Date();
  maxDate = new Date(2020, 0, 1);
  results5: any = [];
  results3: any = [];
  results6: any = [];


  constructor(
    private loginService: LoginService,
    private leaveService: LeaveService,
    public dialog: MatDialog) {

  }



  ngOnInit() {


    const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '500px'
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });

  }


  onSubmit() {
    //alert("Thanks for submitting! Data: " + JSON.stringify(this.initLogin));
    console.log(this.initLogin)
  }

}

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'dialog-overview-example-dialog3',
  templateUrl: 'dialog-overview-example-dialog3.html',
})

export class DialogOverviewExampleDialog3 implements OnInit {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  initLogin = new InitLogin();



  EmpName: string;
  statusMessage: string;
  results5: Object;
  results3: any;
  applyLeave: any;
  key: any;

  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    private router: Router,
    // private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog3>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {

    this.dialogRef.close();
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
      'newPassword': [null, Validators.required],
      'confirmPassword': [null, Validators.required],

      'validate': ''
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate').valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('newPassword').setValidators([Validators.required, Validators.minLength(10)]);
          this.titleAlert = "You need to specify at least 10 characters";
        } else {
          this.formGroup.get('newPassword').setValidators(Validators.required);
        }
        this.formGroup.get('newPassword').updateValueAndValidity();
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
    //alert("call on submit");
    this.post = post;

    //  alert("Thanks for submitting! Data: " + JSON.stringify(this.initLogin));
    console.log("Leave Submit", this.initLogin);

    if (this.initLogin.confirmPassword === this.initLogin.newPassword) {

      this.applyLeave = {
        "Password": this.initLogin.newPassword,
        "IsActivate": "Y"
        // "StartDate": this.leave.fromDate,
        // RMID: localStorage.getItem("RMID"),
        // "EndDate": this.leave.toDate,
        // "LeaveType":this.leave.leaveType,
        // "ReasonForLeave": this.leave.reason,
        // "TotalDays": this.leave.totalLeaves,
        // "EmpName": localStorage.getItem("EmpName"),
        // EmpId: localStorage.getItem("EmpId")
      }
      this.key = localStorage.getItem("DocumentId");

      this.loginService.updateEmployee(this.key, this.applyLeave).subscribe((data: any) => {
        //this.toastr.success(data.results);
        this.dialogRef.close();

        this.router.navigate(['/login']);

      },
        error => {
          //  this.toastr.warning(JSON.stringify(error.error.error));
        });
    } else {
      alert("New password and Confirm password should be same ");
    }

  }

}

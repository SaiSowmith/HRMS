import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InitLogin } from 'src/app/models/init-login';
import { DialogData } from 'src/app/models/test';
import { LoginService } from 'src/app/services/login.service';
import { LeaveService } from 'src/app/services/leave.service';


@Component({
  selector: 'initial-login',
  templateUrl: './initial-login.component.html',
  styleUrls: ['./initial-login.component.scss']
})


export class InitialLoginComponent implements OnInit {

  initLogin = new InitLogin();

  constructor(
    private loginService: LoginService,
    private leaveService: LeaveService,
    public dialog: MatDialog
  ) { }


  ngOnInit() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }


  onSubmit() {
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
  initLogin = new InitLogin();
  initLoginPassword: any;
  documentId: any;

  constructor(

    private loginService: LoginService,
    private leaveService: LeaveService,
    private formBuilder: FormBuilder,
    private router: Router,
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
    this.formGroup = this.formBuilder.group({
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


  onSubmit() {

    console.log("Leave Submit", this.initLogin);

    if (this.initLogin.confirmPassword === this.initLogin.newPassword) {
      var encodedString = window.btoa(this.initLogin.confirmPassword); // returns "bXktbmFtZS0x"

      this.initLoginPassword = {
        "Password": encodedString,
        "IsActivate": "Y"
      }

      this.documentId = localStorage.getItem("DocumentId");
      this.loginService.updateEmployee(this.documentId, this.initLoginPassword).subscribe((data: any) => {
        this.dialogRef.close();
        this.router.navigate(['/login']);
      },
        error => {
          console.log("Error in onSubmit", error)
        });
    } else {
      alert("New password and Confirm password should be same ");
    }
  }

}
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  response: any;
  results2: any = [];
  email: any;
  EmpId: any;

  constructor(
    private http: HttpClient) {
  }

  //Employee APIs

  getEmployee(email, password) {
    return this.http.get(`https://fir-demo-e52b2.firebaseio.com/Employee.json?orderBy="EMail"&equalTo="${email}"`)
  }

  updateEmployee(selectedEmpId, statusUpdateObj) {
    return this.http.patch('https://fir-demo-e52b2.firebaseio.com/Employee/' + selectedEmpId + '/.json', statusUpdateObj).map((res: Response) => {
      return res;
    });
  }




  //LMS APIs

  getLeave(EmpId) {
    return this.http.get(`https://fir-demo-e52b2.firebaseio.com/LMS.json?orderBy="EmpId"&equalTo="${EmpId}"`)
  }

  getLeave2(RMID) {
    return this.http.get(`https://fir-demo-e52b2.firebaseio.com/LMS.json?orderBy="RMID"&equalTo="${RMID}"`)
  }

  updateLeaves(key, statusUpdateObj) {
    console.log(key)
    const req = this.http.patch('https://fir-demo-e52b2.firebaseio.com/LMS/' + key + '/.json', statusUpdateObj)
      .subscribe(
        res => {
          this.results2 = res;
          console.log("UPDATE", res);
          alert("Details have been updated Successfully! ")
        },
        err => {
          alert("Error Occured!!! \n Check the Console");
          console.log("ERROR!!!!", err);
        }
      );
  }

  rejectLeaves(key, statusUpdateObj) {
    console.log(" status update for reject - " + statusUpdateObj);
    return this.http.patch('https://fir-demo-e52b2.firebaseio.com/LMS/' + key + '/.json', statusUpdateObj).map((res: Response) => {
      return res;
    });
  }





  //LBS APIs

  getLBS(EmpId) {
    return this.http.get(`https://fir-demo-e52b2.firebaseio.com/LBS.json?orderBy="EmpId"&equalTo="${EmpId}"`)
  }

  // postLBS() {
  //   const req = this.http.post(`https://fir-demo-e52b2.firebaseio.com/LBS.json`, {

  //     EmpId: prompt("Enter ID"),
  //     EmpDOJ: prompt('Enter DOJ'),
  //     EL: prompt('Enter Earned Leaves'),
  //     CL: prompt('Enter CL'),


  //   })
  //     .subscribe(
  //       res => {
  //         this.results2 = res;
  //         alert("Details have been Added Successfully!")
  //         console.log("POST LBS", res);
  //       },
  //       err => {
  //         alert("Error Occured! \n Check the Console")
  //         console.log("ERROR!!!", err);
  //       }
  //     );
  // }

  updateLBS(selectedEmpId, statusUpdateObj) {
    return this.http.patch('https://fir-demo-e52b2.firebaseio.com/LBS/' + selectedEmpId + '/.json', statusUpdateObj).map((res: Response) => {
      return res;
    });
  }

}
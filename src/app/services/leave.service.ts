import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable({
  providedIn: 'root'
})


export class LeaveService {
  response: any;
  EmpId: any;

  constructor(
    private httpClient: HttpClient
    ) {}


  //LMS APIs

  applyLeave(leave) {
    return this.httpClient.post('https://fir-demo-e52b2.firebaseio.com/LMS.json', leave).map((res: Response) => {
      return res;
    });
  }
  cancelLeaveRequest(documentId){
    return this.httpClient.delete('https://fir-demo-e52b2.firebaseio.com/LMS/'+documentId+'.json').map((res: Response) => {
      return res;
    });
  }

  getReport(from, to) {
    return this.httpClient.get(`https://fir-demo-e52b2.firebaseio.com/LMS.json?orderBy="StartDate"&startAt="${from}"&endAt="${to}"`)
  }
  //
  getLeave() {
    return this.httpClient.get(`https://fir-demo-e52b2.firebaseio.com/LMS.json?orderBy="Status"&equalTo="Approved"`)
  }


  //Email APIs
  sendEmailForApplyLeave(leave) {
    return this.httpClient.post('http://http://54.224.35.68:8080/emailAPI/applyLeave', leave).map((res: Response) => {
      return res;
    });
  }

  sendEmailForApprovedLeaves(leave) {
    return this.httpClient.post('http://54.224.35.68:8080/emailAPI/leaveStatus', leave).map((res: Response) => {
      return res;
    });
  }

  sendEmailByRejectLeaves(leave) {
    return this.httpClient.post('http://54.224.35.68:8080/emailAPI/leaveStatus', leave).map((res: Response) => {
      return res;
    });
  }
  
  sendEmailForCancelLeaveRequest(leave){
    return this.httpClient.post('http://54.224.35.68:8080/emailAPI/leaveStatus', leave).map((res: Response) => {
     return res;
   });
  }




  //LBS APIs

  getLbsData(EmpId) {
    return this.httpClient.get(`https://fir-demo-e52b2.firebaseio.com/LBS.json?orderBy="EmpId"&equalTo="${EmpId}"`).map((res: Response) => {
      return res;
    });
  }

  getLbsData2() {
    return this.httpClient.get(`https://fir-demo-e52b2.firebaseio.com/LBS.json?orderBy="EmpId"`).map((res: Response) => {
      return res;
    });
  }

}
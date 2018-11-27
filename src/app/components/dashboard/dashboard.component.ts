import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  EmpId: any;
  EmpName: any;
  EMail: any;
  EmpDOJ: any;
  RMName: any;
  BloodGroup: any;
  ContactNumber: any;
  Designation: any;
  Team: any;
  RMID: any;

  constructor() { }

  ngOnInit() {
    this.EmpId = localStorage.getItem("EmpId");
    this.EmpName = localStorage.getItem("EmpName");
    this.EMail = localStorage.getItem("EMail");
    this.EmpDOJ = localStorage.getItem("EmpDOJ");
    this.RMName = localStorage.getItem("RMName");
    this.RMID = localStorage.getItem("RMID");

    this.BloodGroup = localStorage.getItem("BloodGroup");
    this.ContactNumber = localStorage.getItem("ContactNumber");
    this.Designation = localStorage.getItem("Designation");
    this.Team = localStorage.getItem("Team");
    console.log("In Dashboard/Profile", this.EmpId, this.EmpName, this.EMail, this.EmpDOJ)
  }

}

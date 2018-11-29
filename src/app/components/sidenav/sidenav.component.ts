import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavItem } from '../menu-list-item/nav-item';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})


export class SidenavComponent implements OnInit {

  selectedMenuActiveChild: any;
  selectedMenuActive: any;
  selectedMenuName: any;
  urlValues: any;
  urlSubvalues: any;
  permissions: any = {};
  loginData: any;
  userRole: string;
  mainPath: string;
  path: string;


  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.loginData) {
      this.mainPath = this.activatedRoute.snapshot.url[0].path;
      this.path = this._router.url;
      if (this.mainPath === 'admin') {
        if (this.path) {
          this.path = this.path.substring(7);
          if (this.path === 'dashboard') {
            this.selectedMenuActive = 'dashboard';
            this.selectedMenuName = 'Dashboard';
          } else if (this.path === 'operator/operators' || this.path === 'operator/operators/createOperator') {
            this.selectedMenuActive = 'operator/operators';
            this.selectedMenuName = 'Operators';
          }
          // else if (this.path === 'admin/leaves' || this.path === 'admin/leaves/ApplyLeave') {
          //   this.selectedMenuActive = 'admin/leaves';
          //   this.selectedMenuName = 'A';
          // } 
          else {
            this.selectedMenuActive = this.path;
          }
        }
      }
    }
  }

  ngOnInit() {
    this.permissionsData();
    this.loadSidebarChanges();
  }

  permissionsData() {
  }

  loadSidebarChanges() {
    if (localStorage.getItem("Role") == "Admin") {
      this.urlValues = [
        {
          'urlLink': 'admin/leavemanagement', 'urlName': 'Leave Management', 'id': 'LeaveManagement', 'mbIcon': 'icon icon-mb-terminal pull-right',
          childs: [
            { 'urlLink': 'leaves', 'urlName': 'My Leaves' },
            { 'urlLink': 'employees-applied-leaves', 'urlName': 'Employee Leaves' }
          ]
        },
        {
          'urlLink': 'admin/reportmanagement', 'urlName': 'Report Management', 'id': 'Reportmanagement', 'mbIcon': 'icon icon-mb-terminal pull-right',
          childs: [
            { 'urlLink': 'reports', 'urlName': 'Leave Reports' },
            { 'urlLink': 'lb-reports', 'urlName': 'Leave Balance Reports' }
          ]
        }
      ];
    } else if (localStorage.getItem("Role") == "Manager") {
      this.urlValues = [

        {
          'urlLink': 'admin/leavemanagement', 'urlName': 'Leave Management', 'id': 'LeaveManagement', 'mbIcon': 'icon icon-mb-terminal pull-right',
          childs: [
            { 'urlLink': 'leaves', 'urlName': 'My Leaves' },
            { 'urlLink': 'employees-applied-leaves', 'urlName': 'Employee Leaves' }
          ]
        },
        {
          'urlLink': 'admin/reportmanagement', 'urlName': 'Report Management', 'id': 'Reportmanagement', 'mbIcon': 'icon icon-mb-terminal pull-right',
          childs: [
            { 'urlLink': 'reports', 'urlName': 'Leave Reports' }
          ]
        }
      ];
    } else {
      this.urlValues = [

        {
          'urlLink': 'admin/leavemanagement', 'urlName': 'Leave Management', 'id': 'LeaveManagement', 'mbIcon': 'icon icon-mb-terminal pull-right',
          childs: [
            { 'urlLink': 'leaves', 'urlName': 'My Leaves' }
          ]
        },
        {
          'urlLink': 'admin/reportmanagement', 'urlName': 'Report Management', 'id': 'Reportmanagement', 'mbIcon': 'icon icon-mb-terminal pull-right',
          childs: [
            { 'urlLink': 'reports', 'urlName': 'Leave Reports' }
          ]
        }
      ];
    }
  }

  sideMenuActiveFun(urlLink, list, index): void {
    this.selectedMenuActive = urlLink;
  }

  sideMenuActiveChild(urlLink, list, index) {
    this.selectedMenuActiveChild = urlLink;
  }

  setDashboard() {
    this.selectedMenuActive = 'dashboard';
    this.selectedMenuName = '';
  }

}
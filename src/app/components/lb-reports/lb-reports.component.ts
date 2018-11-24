import { Component, OnInit } from '@angular/core';
import { LeaveService } from './../../services/leave.service';

@Component({
  selector: 'app-lb-reports',
  templateUrl: './lb-reports.component.html',
  styleUrls: ['./lb-reports.component.scss']
})

export class LbReportsComponent implements OnInit {

  result1: any = [];

  constructor(
    private leaveService: LeaveService,
  ) { }


  ngOnInit() {
    this.leaveBalanceReport();
  }

  leaveBalanceReport() {
    this.leaveService.getLbsData2()
      .subscribe(response => {

        Object.keys(response).forEach(key => {
          this.result1.push(response[key]);
        });
      });
  }

}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { Routes, RouterModule } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminComponent } from './components/admin/admin.component'
import { HttpClientModule } from '@angular/common/http';
import { LeaveComponent, ApplyLeave } from './components/leave/leave.component';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { MatSelectModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatNativeDateModule, MatMenuModule, MatCardModule, MatSidenav, MatInputModule } from '@angular/material';
import {
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatGridListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatStepperModule,

} from '@angular/material';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReportsComponent } from './components/reports/reports.component';
import { LbReportsComponent } from './components/lb-reports/lb-reports.component';
import { EmployeesAppliedLeavesComponent, RejectLeave } from './components/employees-applied-leaves/employees-applied-leaves.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InitialLoginComponent, DialogOverviewExampleDialog3 } from './components/initial-login/initial-login.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'initial-login', component: InitialLoginComponent },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent,
        data: {
          breadcrumbs: 'Dashboard'
        }

      },
      { path: 'leaves', component: LeaveComponent },
      { path: 'employees-applied-leaves', component: EmployeesAppliedLeavesComponent },

      { path: 'reports', component: ReportsComponent },
      { path: 'lb-reports', component: LbReportsComponent },

      { path: 'initial-login', component: InitialLoginComponent },
      { path: 'app-date-picker', component: DatePickerComponent },

    ]
  }





];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidenavComponent,
    DashboardComponent,
    HeaderComponent,
    AdminComponent,
    LeaveComponent,
    MenuListItemComponent,
    ApplyLeave,
    RejectLeave,
    DialogOverviewExampleDialog3,
    ReportsComponent,
    LbReportsComponent,
    EmployeesAppliedLeavesComponent,
    DatePickerComponent,
    InitialLoginComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatNativeDateModule,

    MatSelectModule,


    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatGridListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatStepperModule,
    MatDatepickerModule,
    BrowserAnimationsModule
  ],
  providers: [],
  entryComponents: [
    ApplyLeave,
    RejectLeave,
    DialogOverviewExampleDialog3
  ],

  exports: [
    ApplyLeave,
    RejectLeave,
    DialogOverviewExampleDialog3
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

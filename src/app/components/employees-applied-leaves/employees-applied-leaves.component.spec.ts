import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesAppliedLeavesComponent } from './employees-applied-leaves.component';

describe('EmployeesAppliedLeavesComponent', () => {
  let component: EmployeesAppliedLeavesComponent;
  let fixture: ComponentFixture<EmployeesAppliedLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesAppliedLeavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesAppliedLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

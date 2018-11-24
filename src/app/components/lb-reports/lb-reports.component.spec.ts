import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbReportsComponent } from './lb-reports.component';

describe('LbReportsComponent', () => {
  let component: LbReportsComponent;
  let fixture: ComponentFixture<LbReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

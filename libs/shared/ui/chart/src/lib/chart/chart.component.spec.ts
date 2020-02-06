import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { of, Observable } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { formatDate } from '@angular/common';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartComponent ], 
      schemas : [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.data$ =  new Observable<any>();
    fixture.detectChanges();   
    component.chartData = [];
    
  });

  it('should create', () => {
    expect(component).toBeDefined;
  });
  it('Expect chartdata to update', () => {
      component.data$ = of([[formatDate(new Date(), 'yyyy-mm-dd', 'en-US'), '1'], [formatDate(new Date(), 'yyyy-mm-dd', 'en-US'), '1']]);
      component.ngOnInit();
      expect(component.chartData).toEqual([[formatDate(new Date(), 'yyyy-mm-dd', 'en-US'), '1'], [formatDate(new Date(), 'yyyy-mm-dd', 'en-US'), '1']]);
    });
  });


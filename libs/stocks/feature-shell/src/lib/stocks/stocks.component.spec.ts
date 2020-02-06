import {
  TestBed,
  async,
  fakeAsync,
  ComponentFixture,
  tick
} from '@angular/core/testing';

import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PriceQueryFacade, StocksDataAccessPriceQueryModule } from '@coding-challenge/stocks/data-access-price-query';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StocksComponent } from './stocks.component';
import { StoreModule } from '@ngrx/store';
import {
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule
} from '@angular/material';
import { NxModule } from '@nrwl/nx';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { EffectsModule } from '@ngrx/effects';
import { StocksAppConfigToken } from '@coding-challenge/stocks/data-access-app-config';
import { formatDate } from '@angular/common';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let priceQueryFacade: PriceQueryFacade;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StocksComponent],
      providers: [{
        provide: StocksAppConfigToken, useValue: {
          production: false,
          apiKey: '',
          apiURL: ''
        }
      }],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        SharedUiChartModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        NxModule.forRoot(),
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StocksDataAccessPriceQueryModule
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    priceQueryFacade = fixture.debugElement.injector.get(PriceQueryFacade);
  });

  describe('ngOnInit', () => {
    it('should create stock component comprised of StockPickerForm', () => {
      expect(component).toBeTruthy();
      expect(component.stockPickerForm instanceof FormGroup).toBe(true);
    });
  });
  describe('checkDate', () => {
    it('from date shpuld not be greater than to date', () => {
      component.stockPickerForm.get('toDate').setValue(formatDate(new Date('2020-02-02'), 'yyyy-mm-dd', 'en-US'));
      fixture.detectChanges();
      expect(component.stockPickerForm.get('fromDate').value === formatDate(new Date('2020-02-02'), 'yyyy-mm-dd', 'en-US'));
    });
  });
  describe('fetchQuote', () => {
    it('stok component fetchquote should be called as form vlaue changes and form is valid', fakeAsync(() => {
      spyOn(priceQueryFacade, 'fetchQuote').and.returnValue(null);
      component.stockPickerForm.patchValue({ symbol: 'newvalue', fromDate: new Date(), toDate: new Date() }, { emitEvent: true });
      // Wait for the debounceTime(300)
      tick(300);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(priceQueryFacade.fetchQuote).toHaveBeenCalled();
      });
    }));
  });
});

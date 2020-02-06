import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subject } from 'rxjs';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;

  maxDate: Date;
  destroy$: Subject<boolean> = new Subject<boolean>();
  quotes$ = this.priceQuery.priceQueries$;

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
  }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.stockPickerForm = this.fb.group({
      symbol: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: [new Date(), Validators.required]
    },
      {
        validator: this.dateValidator
      });
    this.stockPickerForm.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchQuote();
    });
  }
  
  /**
   * Reset toDate and fromDate if not valid
   */
  public checkDate(event: MatDatepickerInputEvent<Date>): void {
    const { symbol, fromDate, toDate } = this.stockPickerForm.value;
    if (fromDate && event.value < fromDate) {
      this.stockPickerForm.get('fromDate').setValue(event.value, { onlyself: true });
    }
    if (toDate && event.value > toDate) {
      this.stockPickerForm.get('toDate').setValue(event.value, { onlyself: true });
    }
  }
  private fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, fromDate, toDate);
    }
  }
  private dateValidator(form: FormGroup): Boolean {
    const condition = form.get('fromDate').value <= form.get('toDate').value;
    return condition;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

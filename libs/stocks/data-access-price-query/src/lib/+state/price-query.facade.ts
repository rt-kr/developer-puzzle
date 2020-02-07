import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getPartialPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';

@Injectable()
export class PriceQueryFacade {
   /**
   * Selector getPartialPriceQueries to get API details from store based on date selected. 
   * if Stock symbol doesnt match in store, actual API call is made and put in store
   */
  priceQueries$ = this.store.pipe(
    select(getPartialPriceQueries),
    skip(1),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close])
    )
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  fetchQuote(symbol: string, fromDate: Date, toDate: Date) {
    this.store.dispatch(new FetchPriceQuery(symbol, fromDate, toDate));
  }
}

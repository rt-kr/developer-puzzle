import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError,
  PriceQueryFilter
} from './price-query.actions';
import { PriceQueryPartialState, PRICEQUERY_FEATURE_KEY } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';
import { of } from 'rxjs';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        let apiFullUrl = '';
        const range = 'max'; // range is max range for any symbol. Max data get stored in cache/store and date selector is applied on that       
        apiFullUrl = `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${range}}?range=${range}&token=${this.env.apiKey}`
        if(action.symbol === state[PRICEQUERY_FEATURE_KEY].selectedSymbol){
          return of(new PriceQueryFilter(action.symbol, action.fromDate, action.toDate));
        }else{
          return this.httpClient
            .get(
              apiFullUrl
            )
            .pipe(
              map(resp => new PriceQueryFetched(resp as PriceQueryResponse[], action.symbol, action.fromDate, action.toDate))
            );
        }
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}
}

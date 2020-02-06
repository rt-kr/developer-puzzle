import { PriceQueryAction, PriceQueryActionTypes } from './price-query.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PriceQuery } from './price-query.type';
import { transformPriceQueryResponse } from './price-query-transformer.util';

export const PRICEQUERY_FEATURE_KEY = 'priceQuery';

export interface PriceQueryState extends EntityState<PriceQuery> {
  selectedSymbol: string;
  toDate: Date;
  fromDate: Date;
}

export function sortByDateNumeric(a: PriceQuery, b: PriceQuery): number {
  return a.dateNumeric - b.dateNumeric;
}

export const priceQueryAdapter: EntityAdapter<PriceQuery> = createEntityAdapter<
  PriceQuery
>({
  selectId: (priceQuery: PriceQuery) => priceQuery.dateNumeric,
  sortComparer: sortByDateNumeric
});

export interface PriceQueryPartialState {
  readonly [PRICEQUERY_FEATURE_KEY]: PriceQueryState;
}

export const initialState: PriceQueryState = priceQueryAdapter.getInitialState({
  selectedSymbol: '',
  toDate: new Date(),
  fromDate: new Date()
  
});
/**
   * PriceQueryActionTypes.PriceQueryFetched : Update stock data to store 
   * PriceQueryFilter : Get filter data
   */
export function priceQueryReducer(
  state: PriceQueryState = initialState,
  action: PriceQueryAction
): PriceQueryState {
  switch (action.type) {
    case PriceQueryActionTypes.PriceQueryFetched: {
      return priceQueryAdapter.addAll(
        transformPriceQueryResponse(action.queryResults),
        {...state,
        selectedSymbol: action.symbol,
        toDate: action.toDate,
        fromDate: action.fromDate
        }
      );
    }
    case PriceQueryActionTypes.PriceQueryFilter: {
      return {
        ...state,
        selectedSymbol: action.symbol,
        toDate: action.toDate,
        fromDate: action.fromDate
      };
    }
  }
  return state;
}

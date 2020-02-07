import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  priceQueryAdapter,
  PriceQueryState,
  PRICEQUERY_FEATURE_KEY
} from './price-query.reducer';
import { PriceQuery } from './price-query.type';

const getPriceQueryState = createFeatureSelector<PriceQueryState>(
  PRICEQUERY_FEATURE_KEY
);

export const getSelectedSymbol = createSelector(
  getPriceQueryState,
  (state: PriceQueryState) => state.selectedSymbol
);
export const getToDate = createSelector(
  getPriceQueryState,
  (state: PriceQueryState) => state.toDate
);
export const getFromDate = createSelector(
  getPriceQueryState,
  (state: PriceQueryState) => state.fromDate
);

const { selectAll } = priceQueryAdapter.getSelectors();

export const getAllPriceQueries = createSelector(
  getPriceQueryState,
  selectAll
);
/**
 * date range filter (toDate - fromDate) selector
 */
export const getPartialPriceQueries = createSelector(
  getFromDate,
  getToDate,
  getAllPriceQueries,
  (fromdate: Date, todate: Date, priceQueries: PriceQuery[]) => {
    return priceQueries.filter((pricequery: PriceQuery) =>
      (pricequery.dateNumeric >= fromdate.getTime() && pricequery.dateNumeric <= todate.getTime())
    );
  }
);

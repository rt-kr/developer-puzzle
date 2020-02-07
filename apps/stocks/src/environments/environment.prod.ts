import { StocksAppConfig } from '@coding-challenge/stocks/data-access-app-config';

export const environment: StocksAppConfig = {  
  production: true,
  hapiService: true,
  hapiServer:'http://localhost:3333 ',
  apiKey: ' ', 
  apiURL: 'https://sandbox.iexapis.com'
};

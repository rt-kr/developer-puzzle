/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
const wreck = require('@hapi/wreck');

const method = 'GET'; 
const priceuri = environment.apiURL+'beta/stock/';

const getPriceQuery = async function (symbol, range) {
  const priceurisymbol = priceuri+symbol+'/chart/'+range+'?range='+range+'&token='+environment.apiKey;
  const promise = wreck.request(method, priceurisymbol);
  try {
      const res = await promise;
      const priceres = await wreck.read(res);
      return priceres.toString();
  }
  catch (err) {
      console.log(err);
  }
};

// hapi server config
const server = new Server({
  port: 3333,
  host: 'localhost'
});

// server method policy for caching 
server.method('getPriceQuery', getPriceQuery, {
  cache: {
      expiresIn: 24 * 60 * 60 * 1000,
      generateTimeout: 2000
    }
});

// API routes
server.route({
  path: '/getPriceQuery/{symbol}/{range}',
    method: 'GET',
      handler: async function (request, h) {
        const { symbol, range } = request.params;
        const priceres = await server.methods.getPriceQuery(symbol, range);
        console.log('cached response', priceres);
        return JSON.parse(priceres);
    }
});

const init = async () => {  
  try { 
      await server.start().then(() => {
      });
    } catch (err) { 
      console.error(err); 
    }; 
  console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', err => {
  process.exit(1);
});

init();

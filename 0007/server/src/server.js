import express from 'express';
import cors from 'cors';

import readConfig from './readConfig.js';
import { getJsonPaths, getBedPaths } from './batch.js';
import { getOrderList, filterOrderList } from './orderList.js';
import { fetchOrder, fetchBed } from './fetchOrder.js';
import { updateOrder, updateBed } from './updateOrder.js';

const config = readConfig('../package.json', './config.json');

const jsonPaths = getJsonPaths(config.batchDir);
const [ orderList, orderHash ] = getOrderList(jsonPaths);

// may not need this, please check orderList.js
const bedPaths = getBedPaths(config.batchDir);

const server = () => {
  const app = express();
  const port = 3001;

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Myeloseq HD API test server');
  });
  
  app.get('/api/v1/myeloseq/OrderList', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    if (req.query.open) {
      res.end(JSON.stringify(filterOrderList(orderList)));
    } else {
      res.end(JSON.stringify(orderList));
    }
  });

  app.post('/api/v1/myeloseq/FetchOrder', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    res.end(fetchOrder(req.query, orderHash));
  });

  app.post('/api/v1/myeloseq/UpdateOrder', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    res.end(updateOrder(req.query, req.body, orderHash));
  });

  // TODO create/integrate updateOrder/fetchOrder with bed files (text/plain)

  app.post('/api/v1/myeloseq/FetchBed', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.writeHead(200);
    res.end(fetchBed(req.query, orderHash));
  });

  app.post('/api/v1/myeloseq/UpdateBed', (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.writeHead(200);
    res.end(updateBed(req.query, req.body, orderHash));
  });

  app.listen(port, () => {
    console.log(
      `${config.package.name} (${config.package.version}) listening on port ${port}`
    );
  });
};

export default server;

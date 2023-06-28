import fs from 'fs';

const fetchOrder = (query, orderHash) => {
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const jsonPath = orderEntry.filename;
  return JSON.stringify(JSON.parse(fs.readFileSync(jsonPath)));
};

const fetchBed = (query, orderHash) => {
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const bedPath = orderEntry.bedName;
  return fs.readFileSync(bedPath);
};

export { fetchOrder, fetchBed };


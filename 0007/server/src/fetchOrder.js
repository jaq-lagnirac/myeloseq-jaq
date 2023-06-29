import fs from 'fs';

const fetchOrder = (query, orderHash) => {
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const jsonPath = orderEntry.filename;
  const bedPath = orderEntry.bedName;
  return JSON.stringify(JSON.parse(fs.readFileSync(jsonPath))),
    fs.readFileSync(bedPath);
};

const fetchBed = (query, orderHash) => {
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const bedPath = orderEntry.bedName;
  return fs.readFileSync(bedPath);
};

export { fetchOrder, fetchBed };


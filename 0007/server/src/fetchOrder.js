import fs from 'fs';

const fetchOrder = (query, orderHash) => {
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const jsonPath = orderEntry.filename;
  return JSON.stringify(JSON.parse(fs.readFileSync(jsonPath)));
};

export default fetchOrder;


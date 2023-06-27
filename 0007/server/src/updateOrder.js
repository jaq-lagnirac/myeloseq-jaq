import fs from 'fs';

const updateOrder = (query, body, orderHash)  => {
  const orderJson = JSON.stringify(body, null, 2);
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const jsonPath = orderEntry.filename;
  console.log(jsonPath);
  fs.writeFileSync(jsonPath, orderJson);
  return JSON.stringify('OK');
};

export default updateOrder;


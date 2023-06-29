import fs from 'fs';

const updateOrder = (query, body, orderHash)  => {
  const orderJson = JSON.stringify(body, null, 2);
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const jsonPath = orderEntry.filename;
  console.log(jsonPath);
  fs.writeFileSync(jsonPath, orderJson);
  
  const bedPath = orderEntry.bedName;
  console.log(bedPath);
  fs.writeFileSync(bedPath);
  return JSON.stringify('OK');
};

const updateBed = (query, body, orderHash)  => {
  const hashKey =
      [query.orderId, query.caseNum, query.mrn].join('-');
  const orderEntry = orderHash[hashKey];
  const bedPath = orderEntry.bedName;
  console.log(bedPath);
  fs.writeFileSync(bedPath);
  return 'OK';
};

export { updateOrder, updateBed };
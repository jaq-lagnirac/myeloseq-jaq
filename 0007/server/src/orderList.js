import fs from 'fs';
import path from 'path';
import { uniqueNamesGenerator, names, colors } from 'unique-names-generator';

const getOrderList = (jsonPaths) => {
  const orderList = [];
  const orderHash = {};

  let count = 0;
  for (const jsonPath of jsonPaths) {
    const jsonBasename = path.basename(jsonPath);
    const caseJson = fs.readFileSync(jsonPath);
    const caseData = JSON.parse(caseJson);
    const match = jsonBasename.match(/(W\d\d-\d+)/);
    if (!match) {
      continue;
    }
    const spcNum = match[0];

    // splicing json path and converting it to bed path
    const splicedPath = jsonPath.split('.')
    const bedPath = splicedPath[0].concat('.qc-coverage-region-1_full_res.bed')
    // console.log(bedPath)
    
    const firstName = uniqueNamesGenerator({ dictionaries: [names]});
    let lastName = uniqueNamesGenerator({ dictionaries: [colors]});
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    
    // TODO integrate bedPath into orderEntry
    const orderEntry = {
      firstName: firstName,
      lastName: lastName,
      comment: '',
      dob: caseData.CASEINFO.DOB,
      filename: jsonPath,
      fileVersion: null,
      mrn: caseData.CASEINFO.mrn,
      orderDate: Date.now(),
      orderId: count,
      resultDate: null,
      spcNum: spcNum,
      open: false
    };
    if (count === 13) {
      orderEntry.open = true;
    }

    orderList.push(orderEntry);
    const hashKey = [orderEntry.orderId, orderEntry.spcNum,
      orderEntry.mrn].join('-');
    orderHash[hashKey] = orderEntry;

    count++;
  }

  return [orderList, orderHash];
};

const filterOrderList = (orderList) => {
  const filteredOrderList = [];
  for (const order of orderList) {
    if (order.open) {
      filteredOrderList.push(order);
    }
  }
  return filteredOrderList;
};

export { getOrderList, filterOrderList };


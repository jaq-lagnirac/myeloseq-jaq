import fs from 'fs';
import path from 'path';

const configFile = fs.readFileSync(new URL('./config.json', import.meta.url));
const config = JSON.parse(configFile);

const getJsonPaths = (batchDirPath) => {
  const batchDir = fs.opendirSync(batchDirPath);
  const jsonPaths = [];

  let batchDirEntry;
  while ((batchDirEntry = batchDir.readSync()) !== null) {
    const casePath = path.join(config.batchDir, batchDirEntry.name);
    const caseDir = fs.opendirSync(casePath);
    let caseDirEntry;
    while ((caseDirEntry = caseDir.readSync()) !== null) {
      const jsonFilename = caseDirEntry.name;
      if (jsonFilename.includes('.report.json')) {
        const jsonPath = path.join(casePath, jsonFilename);
        jsonPaths.push(jsonPath);
      }
    }
    caseDir.closeSync();
  }
  batchDir.closeSync();

  return jsonPaths;
};

const getBedPaths = (batchDirPath) => {
  const batchDir = fs.opendirSync(batchDirPath);
  const bedPaths = [];

  let batchDirEntry;
  while ((batchDirEntry = batchDir.readSync()) !== null) {
    const casePath = path.join(config.batchDir, batchDirEntry.name);
    const caseDir = fs.opendirSync(casePath);
    let caseDirEntry;
    while ((caseDirEntry = caseDir.readSync()) !== null) {
      const bedFilename = caseDirEntry.name;
      if (bedFilename.includes('.qc-coverage-region-1_full_res.bed')) {
        const bedPath = path.join(casePath, bedFilename);
        bedPaths.push(bedPath);
      }
    }
    caseDir.closeSync();
  }
  batchDir.closeSync();

  return bedPaths;
};

export { getJsonPaths, getBedPaths };


import { PropTypes } from 'prop-types';
import jstat from 'jstat';

const calculateLod = (covs, sens) => {
  for (let vaf = 0.0001; vaf < 1.0; vaf += 0.0001) {
    let pAllMissed = 1;
    for (const cov of covs) {
      pAllMissed *= jstat.binomial.cdf(4, cov, vaf);
    }
    const pDetect = 1 - pAllMissed;
    if (pDetect >= sens) {
      return vaf;
    }
  }
  return NaN;
};

const calculateFn = (covs, vaf) => {
  let pAllMissed = 1;
  for (const cov of covs) {
    let pMissed = 0;
    for (let k = 0; k < 5; k++) {
      pMissed += jstat.combination(cov, k) * Math.pow(vaf, k) * Math.pow(1 - vaf, cov - k);
    }
    pAllMissed *= pMissed;
  }
  return pAllMissed;
};

const LodOverallStats = (props) => {
  const covs = props.variants.map((row) => row[4]);
  console.log(covs);
  const fn = calculateFn(covs, props.vaf);
  const lod = calculateLod(covs, props.sensitivity);
  console.log(fn);
  console.log(lod);
  return (
    <div id='joint-probabilities'>
      <h2>Joint probabilities</h2>
      <p>lod({props.sensitivity}): {lod.toPrecision(6)}</p>
      <p>fn({props.vaf}): {fn.toPrecision(6)}</p>
      <p>sens({props.vaf}): {(1 - fn).toPrecision(6)}</p>
    </div>
  );
};

LodOverallStats.propTypes = {
  variants: PropTypes.array.isRequired,
  vaf: PropTypes.number.isRequired,
  sensitivity: PropTypes.number.isRequired,
};

export default LodOverallStats;
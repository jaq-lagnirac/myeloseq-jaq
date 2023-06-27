import { PropTypes } from 'prop-types';
import jstat from 'jstat';

const calculateLod = (cov, sens) => {
  if (cov < 1) {
    return NaN;
  }
  for (let vaf = 0.0001; vaf < 1.0; vaf += 0.0001) {
    const pDetect = 1 - jstat.binomial.cdf(4, cov, vaf);
    if (pDetect >= sens) {
      return vaf;
    }
  }
};

const calculateFn = (coverage, vaf) => {
  let pMissed = 0;
  for (let k = 0; k < 5; k++) {
    pMissed += jstat.combination(coverage, k) * Math.pow(vaf, k) * Math.pow(1 - vaf, coverage-k);
  }
  return pMissed;
};

const LodVariantTable = (props) => {
  return (
    <table>
      <thead>
        <tr><th>CHROM</th><th>POS</th>
          <th>REF</th><th>ALT</th><th>COV</th>
          <th>lod({props.sensitivity})</th>
          <th>fn({props.vaf})</th>
          <th>sens({props.vaf})</th>
          <th>fn_j({props.vaf})</th>
          <th>sens_j({props.vaf})</th>
        </tr>
      </thead>
      <tbody>
        {props.variants.map((row, row_i) => {
          const cov = row[4];
          const lod = calculateLod(cov, props.sensitivity);
          const fn = calculateFn(cov, props.vaf);
          const sens = 1 - fn;
          const fn_j = jstat.binomial.cdf(4, cov, props.vaf);
          const sens_j = 1 - fn_j;
          return (
            <tr key={row_i}>
              {row.map((field, field_i) => {
                return (<td key={field_i}>{field}</td>);
              })}
              <td>{lod.toPrecision(6)}</td>
              <td>{fn.toPrecision(6)}</td>
              <td>{sens.toPrecision(6)}</td>
              <td>{fn_j.toPrecision(6)}</td>
              <td>{sens_j.toPrecision(6)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

LodVariantTable.propTypes = {
  variants: PropTypes.array.isRequired,
  vaf: PropTypes.number.isRequired,
  sensitivity: PropTypes.number.isRequired,
};

export default LodVariantTable;
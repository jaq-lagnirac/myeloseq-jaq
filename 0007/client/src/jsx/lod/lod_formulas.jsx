import { PropTypes } from 'prop-types';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const LodFormulas = (props) => {
  console.log('LodFormulas()');

  return (
    <div id='lod-formulas'>
      <h2>Per-variant</h2>
      <b>fn({props.vaf})</b>
      <pre>
        P(var_reads &lt; 5|vaf={props.vaf}, coverage)
      </pre>
      <br />
      <b>sens({props.vaf})</b>
      <pre>
        1 - fn({props.vaf})
      </pre>
      <br />
      <b>lod({props.sensitivity})</b>
      <pre>
        min_vaf(0.0001,0.0002,...) | sens(vaf) &gt;= 0.99
      </pre>

      <h2 className='mt-6'>Joint</h2>
      <b>fn({props.vaf})</b>
      <pre>
        <InlineMath>\Pi</InlineMath>[P(var_reads_i &lt; 5|vaf={props.vaf}, coverage_i)]
      </pre>
      <br />
      <b>sens({props.vaf})</b>
      <pre>
        1 - fn({props.vaf})
      </pre>
      <br />
      <b>lod({props.sensitivity})</b>
      <pre>
        min_vaf(0.0001,0.0002,...) | sens(vaf) &gt;= 0.99
      </pre>

    </div>
  );
};

LodFormulas.propTypes = {
  vaf: PropTypes.number.isRequired,
  sensitivity: PropTypes.number.isRequired,
};

export default LodFormulas;
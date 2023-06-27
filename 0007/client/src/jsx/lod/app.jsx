import { useState, useRef } from 'react';
import IntervalTree from '@flatten-js/interval-tree';
import LodVariantTable from './lod_variant_table';
import LodOverallStats from './lod_overall_stats';
import LodFormulas from './lod_formulas';
//import transcripts from './transcripts.json';
import coverage from './coverage.tsv';

const chrIntervalTrees = {};
console.log('Loading coverage interval trees');
for (const entry of coverage) {
  const chrom = entry[0];
  const start = parseInt(entry[1]) + 1;
  const end = parseInt(entry[2]);
  const cov = parseInt(entry[3]);
  if (!(chrom in chrIntervalTrees)) {
    chrIntervalTrees[entry[0]] = new IntervalTree();
  }
  chrIntervalTrees[chrom].insert([ start, end ], cov);
}

const initialVariants = [ [ 'chr9', 136496801, 'C', 'T', 4498 ] ];
const initialSensitivity = 0.99;
const initialVaf = 0.001;

const App = () => {
  console.log('App()');

  const [ variants, setVariants ] = useState(initialVariants);
  const [ message, setMessage ] = useState('');
  const [ sensitivity, setSensitivity ] = useState(initialSensitivity);
  const [ vaf, setVaf ] = useState(initialVaf);

  const chromosomeRef = useRef(null);
  const positionRef = useRef(null);
  const refRef = useRef(null);
  const altRef = useRef(null);
  const covRef = useRef(null);

  const onChangeSensitivity = (e) => {
    setSensitivity(parseFloat(e.target.value));
  };
  const onChangeVaf = (e) => {
    setVaf(parseFloat(e.target.value));
  };

  const clearVariants = () => {
    setVariants([]);
  };

  const addVariant = () => {
    const chrom = chromosomeRef.current.value;
    const pos = parseInt(positionRef.current.value);
    let cov = covRef.current.value;
    const ref = refRef.current.value;
    const alt = altRef.current.value;
    // Look up cov if not specified
    if (cov.length === 0) {
      if (!(chrom in chrIntervalTrees)) {
        console.log(`Chromosome ${chrom} not found in coverage data`);
        setMessage(`Chromosome ${chrom} not found in coverage data`);
        return;
      }
      const searchResults = chrIntervalTrees[chrom].search([ pos, pos ]);
      if (searchResults.length == 0) {
        console.log(`Position ${pos} not found in coverage data`);
        setMessage(`Position ${pos} not found in coverage data`);
        return;
      }
      if (searchResults.length > 1) {
        console.log(`Position ${pos} multiple entries in coverage data: ${searchResults}`);
        setMessage(`Position ${pos} multiple entries in coverage data: ${searchResults}`);
        return;
      }
      console.log(searchResults);
      cov = searchResults[0];
    } else {
      cov = parseInt(cov);
    }
    console.log(cov);
    setMessage('');
    const newVariant = [ chrom, pos, ref, alt, cov ];
    setVariants(prevState => [ ...prevState, newVariant ]);
  };

  return (
    <>
      <div className='flex space-x-32'>
        <div>
          <pre id='message'>{message}</pre>
          <label htmlFor='chromosome_input'>Chromosome</label>
          <input type='text' name='chromosome_input' ref={chromosomeRef}></input>
          <label htmlFor='position_input'>Position</label>
          <input type='text' name='position_input' ref={positionRef}></input>
          <label htmlFor='ref_input'>Ref</label>
          <input type='text' name='ref_input' ref={refRef}></input>
          <label htmlFor='alt_input'>Alt</label>
          <input type='text' name='alt_input' ref={altRef}></input>
          <label htmlFor='cov_input'>Coverage (leave empty to look up)</label>
          <input type='text' name='cov_input' ref={covRef}></input>
          <button onClick={() => addVariant()}>Add variant</button>
          <button onClick={() => clearVariants()}>Clear variants</button>
        </div>
        <div>
          <div className='flex'>
            <div>
              <label htmlFor='sensitivity_input'>min Sensitivity</label>
              <input type='text' name='sensitivity_input'
                defaultValue={sensitivity} onBlur={onChangeSensitivity} />
              <label htmlFor='vaf_input'>min VAF</label>
              <input type='text' name='vaf_input'
                defaultValue={vaf} onBlur={onChangeVaf} />
            </div>
            <LodOverallStats
              variants={variants}
              sensitivity={sensitivity}
              vaf={vaf}
            >
            </LodOverallStats>
          </div>
          <LodVariantTable
            variants={variants}
            sensitivity={sensitivity}
            vaf={vaf}
          />
          <LodFormulas
            sensitivity={sensitivity}
            vaf={vaf}
          >
          </LodFormulas>
        </div>
      </div>
    </>
  );
};

export default App;
import { JSONTree }  from 'react-json-tree';
import { PropTypes } from 'prop-types';

const JsonView = ({ orderEntry, order }) => {
  console.log('JsonView()');

  return (
    <div>
      <h1 className='mb-3 font-bold'>{orderEntry.spcNum}</h1>

      <div className='mt-6'>
        <JSONTree
          data={order}
          invertTheme={false}
        />
      </div>
    </div>
  );
};

JsonView.propTypes = {
  order: PropTypes.object.isRequired,
  orderEntry: PropTypes.object.isRequired,
};

export default JsonView;
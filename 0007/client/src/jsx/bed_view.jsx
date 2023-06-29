import { PropTypes } from 'prop-types';

const BedView = ({ orderEntry, order }) => {
  console.log('BedView()');

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

BedView.propTypes = {
  order: PropTypes.object.isRequired,
  orderEntry: PropTypes.object.isRequired,
};

export default BedView;
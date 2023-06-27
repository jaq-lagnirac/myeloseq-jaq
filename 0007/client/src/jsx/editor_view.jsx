import { PropTypes } from 'prop-types';

const EditorView = ({ orderEntry, order, addEdit, saveEdit }) => {
  console.log('EditorView()');

  return (
    <div>
      <h1 className='mb-3 font-bold'>{orderEntry.spcNum}</h1>
      <div className='control-container'>
        <button
          onClick={addEdit}
        >
            Save
        </button>
      </div>

      <div className='editor-container'>
        <span>Name</span><span className='col-span-3'>{orderEntry.lastName}, {orderEntry.firstName}</span>
        <span>MRN</span><span className='col-span-3'>{orderEntry.mrn}</span>
        <span>DOB</span><span className='col-span-3'>{orderEntry.dob}</span>
        <span>Order Date</span>
        <span>{new Date(orderEntry.orderDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

EditorView.propTypes = {
  order: PropTypes.object.isRequired,
  orderEntry: PropTypes.object.isRequired,
  addEdit: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired
};

export default EditorView;
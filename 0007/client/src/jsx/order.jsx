import { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import EditorView from './editor_view';
import JsonView from './json_view';
import JsonPlot from './json_plot';
import BedView from './bed_view';

const Order = ({ baseUrl, orderEntry }) => {
  console.log('Order()');
  const [ order, setOrder ] = useState();
  const [ view, setView ] = useState('editor');

  const subsetOrderEntry = {
    orderId: orderEntry.orderId,
    caseNum: orderEntry.spcNum,
    mrn: orderEntry.mrn
  };

  useEffect(() => {
    console.log('Order useEffect()');
    let url = `DUMMY`;
    if (view === 'json')
    {
      url = `${baseUrl}/FetchOrder`;
    }
    else if (view === 'bed')
    {
      url = `${baseUrl}/FetchBed`;
    }
      axios({
        method: 'post',
        url: url,
        params: { ...subsetOrderEntry }
      })
        .then((res) => {
          setOrder(res.data);
        });
  }, []);

  const handleAddEdit = (e) => {
    console.log('handleAddEdit');
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (!newOrder.hasOwnProperty('REPORTING')) {
        newOrder.REPORTING = {};
        newOrder.REPORTING.EDITS = [];
      }
      const reporting = {};
      reporting.versionId = Date.now();
      reporting.user = 'Rosalind Franklin';
      newOrder.REPORTING.EDITS.unshift(reporting);
      return newOrder;      
    });
    e.preventDefault();
  };

  const handleSaveEdit = (e) => {
    console.log('handleSaveEdit');
    let url = `DUMMY`;
    if (view === 'json')
    {
       url = `${baseUrl}/UpdateOrder`;
    }
    else if (view === 'bed')
    {
      url = `${baseUrl}/UpdateBed`;
    }
    axios({
      method: 'post',
      url: url,
      params: { ...subsetOrderEntry },
      data: order
    })
      .then((res) => {
        console.log(`UpdateOrder response: ${res.data}`);
      });
    e.preventDefault();
  };

  return (
    <>
      {order ? 
        <div className='flex mt-12'>
          <nav className='m-w-64'>
            <ul>
              <li className={`pl-2 border-l-2
                  ${view === 'editor' ? 'border-black' : 'border-white'}`}>
                <a href='#' onClick={() => setView('editor')}>Editor</a>
              </li>
              <li className={`mt-3 pl-2 border-l-2
                  ${view === 'json' ? 'border-black' : 'border-white'}`}>
                <a href='#' onClick={() => setView('json')}>JSON</a>
              </li>
              <li className={`mt-3 pl-2 border-l-2
                  ${view === 'bed' ? 'border-black' : 'border-white'}`}>
                <a href='#' onClick={() => setView('bed')}>BED</a>
              </li>
              <li className={`mt-3 pl-2 border-l-2
                  ${view === 'plot' ? 'border-black' : 'border-white'}`}>
                <a href='#' onClick={() => setView('plot')}>Plot</a>
              </li>
            </ul>
          </nav>
          <main className='ml-12 flex-grow'>
            {view === 'editor' ?
              <EditorView
                order={order}
                orderEntry={orderEntry}
                addEdit={handleAddEdit}
                saveEdit={handleSaveEdit}
              /> : null}
            {view === 'json' ?
              <JsonView
                order={order}
                orderEntry={orderEntry}
                addEdit={handleAddEdit}
                saveEdit={handleSaveEdit}
              /> : null}
            {view === 'bed' ?
              <BedView
                order={order}
                orderEntry={orderEntry}
                addEdit={handleAddEdit}
                saveEdit={handleSaveEdit}
              /> : null}
            {view === 'plot' ?
              <JsonPlot
                order={order}
              /> : null}
          </main>
        </div>
        :
        <div className='mt-6'>Loading...</div>
      }
    </>
  );
};

Order.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  orderEntry: PropTypes.object.isRequired
};

export default Order;

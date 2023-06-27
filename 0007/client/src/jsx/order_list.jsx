import { useEffect, useState, useRef } from 'react';
import { PropTypes } from 'prop-types';
import axios from 'axios';

const OrderList = ({ baseUrl, loadOrder }) => {
  console.log('OrderList()');
  const [ orderList, setOrderList ] = useState();
  const [ openOnly, setOpenOnly ] = useState(true);
  const checkboxRef = useRef(null);

  const orderFields = [ 'orderId', 'spcNum', 'orderDate',
    'mrn', 'firstName', 'lastName', 'dob', 'filename',
    'fileVersion', 'resultDate',
    'open' ];

  const handleCheckboxChange = (e) => {
    setOpenOnly(checkboxRef.current.checked);
  };

  useEffect(() => {
    console.log('OrderList useEffect()');
    const url = `${baseUrl}/OrderList`;
    const params = {};
    if (openOnly) {
      params.open = true;
    }
    console.log(url, params);
    axios.get(url, { params })
      .then((res) => {
        setOrderList(res.data);
      });
  }, [ openOnly ]);

  useEffect(() => {
    console.log('OrderList click useEffect()');
    /*
    if (orderList) {
      const firstEntry =
        document.querySelector('table tbody :nth-child(1) td a');
      console.log('Auto-clicking on first order');
      const event = document.createEvent('HTMLEvents');
      console.log(firstEntry);
      event.initEvent('click', true, false);
      firstEntry.dispatchEvent(event);
    }
    */
  }, [ orderList ]);

  const makeTable = () => {
    console.log('makeTable()');
    return (
      <>
        <div className='order-controls'>
          <input
            ref={checkboxRef}
            name='open-orders-checkbox'
            type='checkbox'
            onChange={handleCheckboxChange}
            checked={openOnly}
          />
          <label htmlFor='open-orders-checkbox'>Only show open orders</label>
        </div>
        <table className='table-auto mt-6'>
          <thead>
            <tr>
              {orderFields.map((field, idx) => {
                return <th className='border p-6' key={idx}>{field}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => {
              return(
                <tr key={order.orderId}>
                  {orderFields.map((field, idx) => {
                    {
                      if (idx == 0) {
                        return (
                          <td className='border p-6' key={idx}>
                            <a className='underline'
                              onClick={(e) => { loadOrder(order); e.preventDefault(); }}
                              href=''>{order[field]}
                            </a>
                          </td>
                        );
                      } else {
                        let value = order[field];
                        if (field === 'orderDate') {
                          value = new Date(order[field]).toLocaleDateString();
                        } else if (field === 'open') {
                          value = order[field].toString();
                        }
                        return (
                          <td className='border p-6' key={idx}>{value}</td>
                        );
                      }
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <>
      <h2>Orders</h2>
      {orderList ? makeTable() : 'Loading'}
    </>
  );
};

OrderList.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  loadOrder: PropTypes.func.isRequired
};

export default OrderList;
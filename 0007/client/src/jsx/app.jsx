import { useState } from 'react';
import config from '../config.json';
import OrderList from './order_list';
import Order from './order';

const App = () => {
  console.log('App()');

  const [ orderEntry, setOrderEntry ] = useState();

  const loadOrderHandler = (orderEntry) => {
    console.log('loadOrderHandler()');
    setOrderEntry(orderEntry);
  };

  // If we have loaded an order, show the order. Otherwise show
  // the order list
  return (
    <div className='app-container'>
      <header>
        <h1>MyeloSeq HD</h1>
        <div id='user-id'>
          Test User [<a href='#'>log out</a>]
        </div>
      </header>
      {orderEntry ?
        <Order
          baseUrl={config.baseUrl}
          orderEntry={orderEntry}
        />
        :
        <OrderList
          baseUrl={config.baseUrl}
          loadOrder={loadOrderHandler}
        />
      }
    </div>
  );
};

export default App;

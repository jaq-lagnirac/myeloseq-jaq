import ReactDOM from 'react-dom/client';
import App from './jsx/app';
import './index.css';

(() => {
  console.log('index.jsx');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  /*
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  */
  root.render(
    <App />
  );
})();

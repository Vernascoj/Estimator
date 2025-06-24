
import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';

function EstimatorApp() {
  return React.createElement('div', null, [
    React.createElement('h1', { key: 'title' }, 'Estimator App'),
    React.createElement('p', { key: 'desc' }, 'Fully Functional Estimator UI'),
    React.createElement('button', {
      key: 'start',
      onClick: () => alert('App is starting...'),
    }, 'Start Estimating'),
  ]);
}

const root = document.getElementById('app');
ReactDOM.createRoot(root).render(React.createElement(EstimatorApp));

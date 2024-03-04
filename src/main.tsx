import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import Timer from './components/Timer'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export { Timer }

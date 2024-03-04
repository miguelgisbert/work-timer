import React from 'react'
import ReactDOM from 'react-dom'
import Timer from './components/Timer'

ReactDOM.render(
  <React.StrictMode>
    <Timer />
  </React.StrictMode>,
  document.getElementById('root')
);

export { Timer }

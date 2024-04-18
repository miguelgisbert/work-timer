## mg-work-timer

mg-work-timer is a React-typescript package to have a simple stopwatch to register work and resting daily times for your employees or for yourself. 

[![npm](https://img.shields.io/npm/v/mg-work-timer)](https://www.npmjs.com/package/mg-work-timer)

<p align="center">
  <img src="https://raw.githubusercontent.com/miguelgisbert/work-timer/master/src/assets/TimerScreenshot.png" alt="Timer example">
</p>

## Installation

```bash
npm install mg-work-timer
```

## Use

```ts
import { Timer } from 'mg-work-timer'

function App() {

  return (
    <>
        <Timer />
    <>
  )
}

export default App
```

To use the Login system create a project on Firebase, activate auth, enable the login with email at authentication options and change the firebaseConfig data at /src/firebaseConfig.ts to your own data
```js
const firebaseConfig = {
  apiKey: "____________________________________",
  authDomain: "___________.firebaseapp.com",
  projectId: "___________",
  storageBucket: "___________.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:__________________",
  measurementId: "G-__________",
}
```

## Funding

If you find it useful please support my work! 

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/miguelgisbert)




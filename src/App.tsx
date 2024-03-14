import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Timer from './components/Timer'
import Header from './components/Header'

const theme = createTheme({
  components: {
   
  },
})

function App() {
    return (
      <ThemeProvider theme={theme}>
        <Header />
        <Timer />
      </ThemeProvider>
    )
}

export default App
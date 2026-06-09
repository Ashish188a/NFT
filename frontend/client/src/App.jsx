import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import Web3Provider from './contexts/Web3Provider'
import Login from "./pages/Login";

function App() {
  return (
    <Web3Provider>
      <RouterProvider router={routes} />
    </Web3Provider>
  )
}

export default App
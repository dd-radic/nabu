import './App.css'
import {HashRouter as Router, Routes, Route} from "react-router-dom"
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import {Layout} from './components/Layout'

/**
 * This file is used as a router for the pages
 */

const App = () => {

  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
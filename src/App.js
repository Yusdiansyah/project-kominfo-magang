import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout.js';
import {Routes,Route} from 'react-router-dom';
import Dashboard from './components/Dashboard.js'
import Economic from './components/Economic.js'
import Social from './components/Social.js'
import About from './components/About.js'
import Census from './components/Census.js'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="economic" element={<Economic/>}/>
        <Route path="social" element={<Social/>}/>
        <Route path="census" element={<Census/>}/>
        <Route path="about" element={<About/>}/>
      </Route>
    </Routes>
  );
}

export default App;

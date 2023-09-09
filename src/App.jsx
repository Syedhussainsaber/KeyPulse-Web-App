import './App.css'
import UploadData from './components/UploadData'
import "./styles/uploadData.scss"
import "./styles/app.scss"
import "./styles/navbar.scss"
import "./styles/endpopup.scss"
import DisplayData from './components/DisplayData'
import Explore from './components/Explore'
import { useState } from 'react'
import Predict from './components/Predict'
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';


function App() {
 
  return (
    <>
    <div className="app-section">
      <video src="/background.mp4" autoPlay={true} loop={true} muted={true} controls={false} ></video>
  
<Router>
{/* <UploadData/> */}
{
<Routes>
  {/* displayData ? <>

  <Navbar className="navbar" setDisplayData={setDisplayData}/>
  <h2 className='title'>Data</h2>

    <DisplayData/></>: <>  <h2 className='title'>Select a dataset</h2>
  <UploadData setDisplayData={setDisplayData}/>
  </> */}

  <Route path='/' Component={UploadData}/>
  <Route path='/prepare' Component={DisplayData} />
<Route path='/explore' Component={Explore} />
<Route path='/predict' Component={Predict} />
</Routes>
}
</Router>
    </div>
    </>
  )
}

export default App

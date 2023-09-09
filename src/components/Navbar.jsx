import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  return (
<div className="nav-container">
<nav className="navbar navbar-expand-lg navbar-light bg-white">
  <div className="container-fluid">
  <Link to={"/"} style={{textDecoration:"none"}}>
    {location.pathname!=='/' ?  <button type='button' className="navbar-brand btn btn-primary text-white"> Go Back</button>:<img src={'/keyPulse.png'} alt='Key Pulse' width={185} height={82}  />}
 
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
        <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to={"/prepare"}>Prepare</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to={"/explore"}>Explore</Link>
        </li>
        <li className="nav-item">

           <Link className="nav-link" to={"/predict"}>Predict</Link>
        </li>
        <li className="nav-item">
<Link className="nav-link">Report</Link>
        </li>
        {/* <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a> */}
          {/* <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider"/></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul> */}
        {/* </li> */}
    
      </ul>
      {/* <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form> */}
    </div>
  </div>
</nav>
</div>
  )
}

export default Navbar
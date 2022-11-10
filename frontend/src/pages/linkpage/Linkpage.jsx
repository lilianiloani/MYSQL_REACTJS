import React from 'react'
import "./linkpage.scss"
import {Link} from "react-router-dom"


const Linkpage = () => {
  return (
    <section className='linkpage'>
      
        <h1>Links</h1>
            <br />
        <h2>Public</h2>
    
            <Link to="/">Home Page</Link>
            
            <br/>
            <br />
        <h2>Private</h2>
       
        <Link to="/admin">Admin Page</Link> 
            



    </section>
  )
}

export default Linkpage
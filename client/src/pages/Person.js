import React from 'react'
import "../css/Person.css"
import { useParams } from 'react-router-dom'

function Person() {
    const{ id } = useParams();
  return (
    <div className='person-page'>
        <div className="person-banner"></div>
    </div>
  )
}

export default Person
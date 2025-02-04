import React from 'react'

import '../css/FormGroup.css'

function FromGroup({ uid, legend, children }) {
  return (
    <fieldset id={uid} className='form-group'>
      <legend>{legend}</legend>
      <div className='form-group__children'>{children}</div>
    </fieldset>
  )
}

export default FromGroup
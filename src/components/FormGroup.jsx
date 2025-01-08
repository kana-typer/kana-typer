import React from 'react'

import '../css/FormGroup.css'

function FromGroup({ uid, legend, children }) {
  return (
    <fieldset id='form-group' className={uid}>
      <legend>{legend}</legend>
      <div className='form-group__children'>{children}</div>
    </fieldset>
  )
}

export default FromGroup
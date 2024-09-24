import React from 'react'

function FromGroup({ uid, legend, children }) {
  return (
    <fieldset className={uid}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  )
}

export default FromGroup
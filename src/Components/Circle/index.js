import React from 'react'
import "./style.css"
function Circle({onAction}) {
  return (
    <>
      <div className="Circle" onClick={onAction}></div>
    </>
  )
}

export default Circle

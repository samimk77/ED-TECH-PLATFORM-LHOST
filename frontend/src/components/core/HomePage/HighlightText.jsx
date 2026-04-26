import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className=' font-bold bg-gradient-to-br from-blue-500 to-cyan-300 text-transparent bg-clip-text'>
        {text}
    </span>
  )
}

export default HighlightText
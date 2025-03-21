import React from 'react'
import { SignIn } from '@clerk/clerk-react'

function Signin() {
  return (
    <div className='d-flex justify-content-center' style={{marginTop:'100px'}}>
    <SignIn/>
    </div>
  )
}

export default Signin
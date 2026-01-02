import React from 'react'
import Leftcontent from './Leftcontent'
import RightContent from './RightContent'

const Page1content = (props) => {
  return (
    <div className='pb-16 pt-6 flex items-center gap-10 h-[90vh]  px-18' >
        <Leftcontent/>
        <RightContent users={props.users} />
    </div>
  )
}

export default Page1content
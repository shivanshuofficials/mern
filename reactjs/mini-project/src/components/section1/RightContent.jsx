import React from 'react'
import 'remixicon/fonts/remixicon.css'
import RightCard from './RightCard'
const RightContent = (props) => {
  return (
    <div id='right' className='h-full overflow-x-auto rounded-4xl flex flex-nowrap gap-10 p-4 w-2/3'>
         {props.users.map(function(elem,idx){
          return <RightCard key={idx} id={idx} color= {elem.color} img= {elem.img} intro={elem.intro} tags={elem.tags}/>
         })}
    </div>
  )
}

export default RightContent
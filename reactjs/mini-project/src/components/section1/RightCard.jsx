import Rightcardcontent from './Rightcardcontent'

const RightCard = (props) => {
    return (
        <div className='h-full shrink-0 w-80 rounded-4xl overflow-hidden relative'>
            <img className='h-full w-full object-cover' src={props.img} alt="" />
           <Rightcardcontent color={props.color} id={props.id} intro={props.intro} tags={props.tags}/>
        </div>
    )
}

export default RightCard

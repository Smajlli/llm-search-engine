import '../app/globals.css'
import UserMessage from './UserMessage';


function Response({answer, question, userId}) {
    return <div>
        <UserMessage question={question} userId={userId}/>
        <div className='w-full mb-8'>
            <p className='font-bold mb-4 text-cyan-600'>Chat</p>
            {answer}
        </div>
    </div>
}

export default Response;
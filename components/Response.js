import '../app/globals.css'
import UserMessage from './UserMessage';


function Response({answer, question, userId}) {
    return <div className='w-full flex flex-col'>
        <UserMessage question={question} userId={userId}/>
        <div className='w-full mb-8 dark:text-white'>
            <p className='font-bold mb-2 text-slate-600 dark:text-slate-300'>SSays</p>
            {answer}
        </div>
    </div>
}

export default Response;
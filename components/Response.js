import '@/app/globals.css'
import UserMessage from './UserMessage';
import Link from 'next/link';


function Response({answer, question, sources, userId}) {
    return <div className='w-full flex flex-col'>
        <UserMessage question={question} userId={userId}/>
        <div className='w-full mb-8 dark:text-white'>
            <p className='font-bold mb-2 text-slate-600 dark:text-slate-300'>SSays</p>
            {answer}
        </div>
        <div className='w-full mb-6'>
            <div className='font-bold mb-4 dark:text-white'>Sources:</div>
            <ul>
                <li> <Link href={sources[0]} className='dark:text-white hover:underline text-sky-500'>{sources[0]}</Link> </li>
                <li> <Link href={sources[1]} className='dark:text-white hover:underline text-sky-500'>{sources[1]}</Link> </li>
                <li> <Link href={sources[2]} className='dark:text-white hover:underline text-sky-500'>{sources[2]}</Link> </li>
            </ul>
        </div>
    </div>
}

export default Response;
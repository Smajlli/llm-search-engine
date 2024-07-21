import '@/app/globals.css'
import UserMessage from './UserMessage';
import Link from 'next/link';


function Response(props : {answer : string, question : string, sources : string[], userId : string}) {
    return <div className='w-full flex flex-col'>
        <UserMessage question={props.question} userId={props.userId}/>
        <div className='w-full mb-8 dark:text-white'>
            <p className='font-bold mb-2 text-slate-600 dark:text-slate-300'>SSays</p>
            {props.answer}
        </div>
        <div className='w-full mb-6'>
            <div className='font-bold mb-4 dark:text-white'>Sources:</div>
            <ul>
                <li> <Link href={props.sources[0]} className='dark:text-white hover:underline text-sky-500'>{props.sources[0]}</Link> </li>
                <li> <Link href={props.sources[1]} className='dark:text-white hover:underline text-sky-500'>{props.sources[1]}</Link> </li>
                <li> <Link href={props.sources[2]} className='dark:text-white hover:underline text-sky-500'>{props.sources[2]}</Link> </li>
            </ul>
        </div>
    </div>
}

export default Response;
import '@/app/globals.css'
import Question from './Question';

function QuestionsContainer({questions, text}) {
    return <div className='flex flex-col p-2 '>
        <div className='text-xs font-bold text-slate-500 mb-2'>{text}</div>
        <div>{questions.map(q => <Question text={q.title} convoId={q.id}/>)}</div>
    </div>
}

export default QuestionsContainer;
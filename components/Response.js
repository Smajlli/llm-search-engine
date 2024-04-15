import '../app/globals.css'

function Response({answer, question}) {
    return <div className='w-full mb-8'>
        <p className='font-bold mb-4 text-cyan-600'>{question}</p>
        {answer}
    </div>
}

export default Response;
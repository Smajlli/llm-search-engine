import '../app/globals.css'

function Button(props: {text: string}) {
    return <button className='w-14 h-8 bg-cyan-600 rounded-lg text-center text-white'>{props.text}</button>
}

export default Button;
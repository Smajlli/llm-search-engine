import '../globals.css'
import Button from '../../components/Button';

function Chat() {
    return <div className=' w-full h-full grid place-content-center'>
            <div className='text-3xl font-bold mb-4'> How can I help You today ? </div>
            <input type='text' className='rounded-full w-96'></input>
            <Button text={'Ask'}/>
        </div>
}

export default Chat;
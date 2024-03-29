'use client'

import '../globals.css'
import Button from '../../components/Button';
import { useState } from 'react';
import axios from 'axios';

function Chat() {
    const [question, setQuestion] = useState('');
    const data = new FormData();


    const handleChange = (e) => {
        setQuestion(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        data.append('key',question);

        try {
            await axios({
                method: 'POST',
                url: '/api/chat',
                data: data
            }).then(res => console.log(res.data))
        } catch(err) {
            console.log(err)
        }
    
    }

    return <div className=' w-full h-full grid place-content-center'>
            <div className='text-3xl font-bold mb-4'> How can I help You today ? </div>
            <form onSubmit={handleSubmit}>
                <input type='text' className='rounded-full w-96' onChange={handleChange}></input>
                <Button text={'Ask'} />
            </form>
        </div>
}

export default Chat;
'use client'

import '../globals.css'
import Button from '../../components/Button';
import { useState, Suspense } from 'react';
import axios from 'axios';
import Response from '@/components/Response';
import Loading from '@/components/Loading';
import { supabase } from '@/utils/supabase/supabase';
import { useRouter } from 'next/navigation';

function Chat() {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [isQuestion, setIsQuestion] = useState(false);
    const data = new FormData();
    const router = useRouter();

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
            }).then(res => setAnswer(res.data))
        } catch(err) {
            console.log(err)
        }
        setIsQuestion(!isQuestion);
    }

    const handleLogout = async () => {
        const { err } = await supabase.auth.signOut();
        console.log('LOGGED OUT !')
        router.refresh();
    }

    return <div className=' w-full h-full flex flex-col flex-wrap justify-center items-center'>
            <div className='text-3xl font-bold mb-4'> How can I help You today ? </div>
            <form onSubmit={handleSubmit} className='mb-11'>
                <input type='text' className='rounded-full w-96' onChange={handleChange}></input>
                <Button text={'Ask'} />
            </form>
        {!answer || answer.length === 0 && isQuestion === false ? null : 
            <div className='w-4/5'>
                <p className='font-bold mb-4 text-cyan-600'>{question}</p>
                <Suspense fallback={<Loading/>}>
                    <Response answer={answer} />
                </Suspense>
            </div>
        }
        <button onClick={handleLogout}>Log out</button>
        </div>
}

export default Chat;
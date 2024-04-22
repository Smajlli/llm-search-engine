'use client'

import '@/app/globals.css'

import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import { useRouter } from 'next/navigation';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async () => {
        try {
            const { data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            router.refresh();
        } catch(err) {
            console.log(err)
        }
        
    }

    return <div className='flex items-center justify-center'>
        <div className='flex flex-col'>
            <div className='text-center text-3xl font-bold my-8'>Log in</div>
            <div className='flex flex-col'>
                <label htmlFor='email'>E-mail:</label>
                <input type='text' id='email' name='email' value={email} onChange={handleEmail} />
            </div>
            <div className='flex flex-col'>
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' value={password} onChange={handlePassword} />
            </div>
            <button className='p-2 mt-8 text-center border-solid border-2 border-orange-400 rounded-2xl hover:border-teal-200 duration-200' onClick={handleLogin}>Log in</button>
        </div>
    </div>
}

export default Login;
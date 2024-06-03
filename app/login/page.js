'use client'

import '@/app/globals.css'

import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

    return <div className='h-screen flex items-center justify-center items-center'>
        <div className='flex flex-col'>
            <div className='text-center text-3xl font-bold my-8'>Log in</div>
            <div className='flex flex-col'>
                <label htmlFor='email'>E-mail:</label>
                <input type='text' id='email' name='email' value={email} onChange={handleEmail} className='border-solid border-2 rounded-2xl'/>
            </div>
            <div className='flex flex-col'>
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' value={password} onChange={handlePassword} className='border-solid border-2 rounded-2xl' />
            </div>
            <button className='p-2 mt-8 text-center font-bold bg-slate-200 border-solid rounded-2xl hover:bg-slate-100 duration-200' onClick={handleLogin}>Log in</button>
            <div className='text-center text-sm my-2'> Don't have account ? </div>
            <Link href={'/signup'} className='text-center text-sm hover:underline'>Create account</Link>
        </div>
    </div>
}

export default Login;
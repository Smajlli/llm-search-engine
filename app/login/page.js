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
    const logo = ':)';

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
        router.push('/chat');
    }

    return <div className='h-screen flex h-full w-full flex flex-col sm:flex-row dark:bg-slate-900'>
            <div className=' justify-center flex-col items-center bg-slate-100 h-full w-full hidden sm:flex dark:bg-slate-800 dark:text-white'>
                <div className='text-6xl font-bold'>{logo} SSays</div>
                <div className='mt-6'>Large Language Model App</div>
                <div className='font-thin'>powered by Amer Smajlovic</div>
            </div>
            <div className="flex justify-center flex-col items-center bg-slate-100 h-1/5 w-full sm:hidden dark:bg-slate-800 dark:text-white">
                <div className='text-4xl font-bold'>{logo} SSays</div>
                <div className='mt-6 text-xs'>Large Language Model App</div>
                <div className='font-thin text-xs'>powered by Amer Smajlovic</div>
            </div>
            <div className='flex flex-col h-full w-full items-center justify-center'>
                <div className='flex flex-col justify-center'>
                    <div className='text-center text-3xl font-bold my-8 dark:text-white'>Log in</div>
                    <div className='flex flex-col'>
                        <label htmlFor='email' className='dark:text-white'>E-mail:</label>
                        <input type='text' id='email' name='email' value={email} onChange={handleEmail} className='border-solid border-2 rounded-2xl' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='password' className='dark:text-white'>Password:</label>
                        <input type='password' id='password' name='password' value={password} onChange={handlePassword} className='border-solid border-2 rounded-2xl' />
                    </div>
                    <button className='p-2 mt-8 text-center font-bold bg-slate-200 border-solid rounded-2xl hover:bg-slate-100 duration-200 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500' onClick={handleLogin}>Log in</button>
                    <div className='text-center text-sm my-2 dark:text-white'> Don't have account ? </div>
                    <Link href={'/signup'} className='text-center text-sm hover:underline dark:text-white'>Create account</Link>
                </div>
            </div>
        </div>
}

export default Login;
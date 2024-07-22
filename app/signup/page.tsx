'use client'

import '@/app/globals.css'
import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

function Signup() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');
    const router = useRouter();
    const logo : string = ':)'

    const handleEmail = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleUsername = (e : React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleFullname = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFullname(e.target.value);
    }

    const handleSignup = async (e : React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();        
        await supabase.auth.signUp({
            email, 
            password,
            options: {
                data: {
                    username,
                    full_name: fullname,
                    profile_image: ''
                }
            }
        });
        router.push('/chat');
    }

    return <div className='h-screen flex w-full h-full flex flex-col sm:flex-row dark:bg-slate-900'>
        <div className='flex justify-center flex-col items-center bg-slate-100 h-full w-full hidden sm:flex dark:bg-slate-800 dark:text-white'>
            <div className='flex flex-row items-center'><Logo width={150} height={150} /> <div className='text-6xl font-bold'>SSays</div></div>
            <div className='mt-6'>Large Language Model App</div>
            <div className='font-thin'>powered by Amer Smajlovic</div>
        </div>
        <div className="flex justify-center flex-col items-center bg-slate-100 h-1/5 w-full sm:hidden dark:bg-slate-800 dark:text-white">
            <div className='text-4xl font-bold'>{logo} SSays</div>
            <div className='mt-6 text-xs'>Large Language Model App</div>
            <div className='font-thin text-xs'>powered by Amer Smajlovic</div>
        </div>
        <div className='flex flex-col h-full w-full items-center justify-center'>
            <div className='flex flex-col justify-center items-center'>
                <div className='text-center mb-8 text-3xl font-bold dark:text-white'>Sign Up</div>
                <form onSubmit={handleSignup} className='flex flex-col justify-center'>
                    <div className='flex flex-col'>
                        <label htmlFor="fullname" className='dark:text-white'>Full name:</label>
                        <input type='text' name='fullname' id='fullname' value={fullname} onChange={handleFullname} className='border-solid rounded-2xl' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="username" className='dark:text-white'>Username:</label>
                        <input type='text' name='username' id='username' value={username} onChange={handleUsername} className='border-solid rounded-2xl' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="email" className='dark:text-white'>Email:</label>
                        <input type='text' name='email' id='email' value={email} onChange={handleEmail} className='border-solid rounded-2xl' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="password" className='dark:text-white'>Password:</label>
                        <input type='password' name='password' id='password' value={password} onChange={handlePassword} className='border-solid rounded-2xl' />
                    </div>
                    <button className="p-2 mt-8 text-center font-bold border-solid bg-slate-200 rounded-2xl hover:bg-slate-100 duration-200 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500">Sign Up</button>
                    <div className='text-center text-sm my-2 dark:text-white'>Already have account ?</div>
                    <Link href={'/login'} className='text-center text-sm hover:underline dark:text-white'>Log in</Link>
                </form>
            </div>
        </div> 
    </div>
}

export default Signup;
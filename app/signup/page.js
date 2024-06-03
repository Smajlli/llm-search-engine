'use client'

import '@/app/globals.css'
import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Link from 'next/link';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleFullname = (e) => {
        setFullname(e.target.value);
    }

    const handleSignup = async (e) => {
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
    }

    return <div className='h-screen flex justify-center items-center mt-8'>
        <div className='flex flex-col'>
            <div className='text-center mb-8 text-3xl font-bold'>Sign Up</div>
            <form onSubmit={handleSignup} className='flex flex-col justify-center'>
                <div className='flex flex-col'>
                    <label htmlFor="fullname">Full name:</label>
                    <input type='text' name='fullname' id='fullname' value={fullname} onChange={handleFullname} className='border-solid rounded-2xl' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="username">Username:</label>
                    <input type='text' name='username' id='username' value={username} onChange={handleUsername} className='border-solid rounded-2xl' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email">Email:</label>
                    <input type='text' name='email' id='email' value={email} onChange={handleEmail} className='border-solid rounded-2xl'/>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Password:</label>
                    <input type='password' name='password' id='password' value={password} onChange={handlePassword} className='border-solid rounded-2xl' />
                </div>
                <button className="p-2 mt-8 text-center font-bold border-solid bg-slate-200 rounded-2xl hover:bg-slate-100 duration-200">Sign Up</button>
                <div className='text-center text-sm my-2'>Already have account ?</div>
                <Link href={'/login'} className='text-center text-sm hover:underline'>Log in</Link>
            </form>
        </div>
    </div>
}

export default Signup;
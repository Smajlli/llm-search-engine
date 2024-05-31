'use client'

import '@/app/globals.css'
import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';

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

    return <div className='flex justify-center content-center mt-8'>
        <div className='flex flex-col'>
            <div className='text-center mb-8 text-3xl font-bold'>Sign Up</div>
            <form onSubmit={handleSignup}>
                <div className='flex flex-col'>
                    <label htmlFor="fullname">Full name:</label>
                    <input type='text' name='fullname' id='fullname' value={fullname} onChange={handleFullname} />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="username">Username:</label>
                    <input type='text' name='username' id='username' value={username} onChange={handleUsername} />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email">Email:</label>
                    <input type='text' name='email' id='email' value={email} onChange={handleEmail} />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Password:</label>
                    <input type='password' name='password' id='password' value={password} onChange={handlePassword} />
                </div>
                <button className="p-2 mt-8 text-center border-solid border-2 border-orange-400 rounded-2xl hover:border-teal-200 duration-200">Sign Up</button>
            </form>
        </div>
    </div>
}

export default Signup;
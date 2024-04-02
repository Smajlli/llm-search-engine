'use client'

import '@/app/globals.css'

import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import { redirect } from 'next/navigation';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            console.log('SESSION ESTABLISHED :D', data);
        } catch(err) {
            console.log(err)
        }
    }

    return <div>
        <div>Log in</div>
        <div>e-mail:</div>
        <input type='text' name='email' value={email} onChange={handleEmail}/>
        <div>password:</div>
        <input type='password' name='password' value={password} onChange={handlePassword} />
        <button onClick={handleLogin}>Log in</button>
    </div>
}

export default Login;
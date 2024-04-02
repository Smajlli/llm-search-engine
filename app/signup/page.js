'use client'

import '@/app/globals.css'
import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import { useRouter } from 'next/navigation';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSignup = async () => {
        try {
            const { data } = await supabase.auth.signUp({
                email, 
                password,
                /* options: {
                emailRedirectTo: 'http://localhost:3000'
                } */
            });
            console.log(data)
        } catch(err) {
            console.log(err)
        }
    }

    return <div>
        <div>Sign Up</div>
        <div>email:</div>
        <input type='text' name='email' value={email} onChange={handleEmail} />
        <div>password:</div>
        <input type='password' name='password' value={password} onChange={handlePassword} />
        <button onClick={handleSignup}>Sign Up</button>
    </div>
}

export default Signup;
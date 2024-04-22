'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";

export default function Home() {
  const [profile, setProfile] = useState();

  useEffect(() => {
    async function getProfile() {
      const {data: {user}} = await supabase.auth.getUser();
      setProfile(user);
    }
    getProfile();
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative bg-slate-50">
      <div className="w-10/12 h-10/12 flex items-center justify-center absolute">
        <div dir="rtl">
          <div className="w-72 h-60 bg-teal-200 inline-block rounded-full absolute blur-2xl start-0" ></div>
          <div className="w-72 h-60 bg-orange-400 inline-block rounded-full absolute blur-2xl " ></div>
        </div>
        <div className="flex flex-col justify-center items-center h-3/4 w-3/4">
          <div className="text-6xl font-semibold text-center z-10 drop-shadow-xl">Wellcome to LLM powered search engine</div>
          <Link href={'/chat'} className="p-2 mt-8 text-center border-solid border-2 border-orange-400 rounded-2xl hover:border-teal-200 duration-200">Get started</Link>
        </div>
      </div>
    </main>
  );
}

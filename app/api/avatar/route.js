import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase";

export async function POST(req) {
    const avatars = [
        'Avatar1',        
        'Avatar2',        
        'Avatar3',        
        'Avatar4',        
        'Avatar5',        
        'Avatar6',        
        'Avatar7',        
    ]

    const randomNum = Math.floor(Math.random() * 6);

    const reqData = await req.formData();

    return NextResponse.json(avatars[randomNum]);
}
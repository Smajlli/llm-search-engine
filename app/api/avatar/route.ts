import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const avatars: string[] = [
        'Avatar1',        
        'Avatar2',        
        'Avatar3',        
        'Avatar4',        
        'Avatar5',        
        'Avatar6',        
        'Avatar7',        
    ]

    const randomNum: number = Math.floor(Math.random() * 6);

    return NextResponse.json(avatars[randomNum]);
}
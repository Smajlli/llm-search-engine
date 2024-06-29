import { NextResponse } from "next/server"
import { supabase } from "@/utils/supabase/supabase";
import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_KEY});

export async function POST(req) {
    
    const reqData = await req.formData();

    const question = reqData.get('key');
    const userId = reqData.get('userId');
    const convoId = reqData.get('convoId');

    let chatHistory = [];

    try {
        await supabase.from('chat_history').insert({
            role: "user",
            content: question,
            user_id: userId,
            convo_id: convoId
        })
    } catch(err) {
        console.log(err)
    }

    try {
        const {data} = await supabase.from('chat_history').select().eq('user_id', userId);
        data.map((res) => {
            return chatHistory.push({role: res.role, content: res.content});
        })
    } catch (err) {
        console.log(err)
    }

    async function chat() {
        return groq.chat.completions.create({
            messages: chatHistory,
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 1024,
            stop: null,
            stream: false,
        });
    };

    async function response() {
        const chatCompletion = await chat();
        return NextResponse.json(chatCompletion.choices[0]?.message?.content || "");
    }

   return response()
}
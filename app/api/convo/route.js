import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase";
import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_KEY});

export async function POST(req) {
    const reqData = await req.formData();

    const id = reqData.get('id');

    let chatHistory = [];

    const { data, error } = await supabase.from('chat_history').select('*').eq('convo_id', id);
    data.map(convo => chatHistory.push({role: convo.role, content: convo.content}));
    if(error) {
        console.log(error);
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

    return response();
}
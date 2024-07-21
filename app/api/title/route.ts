import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_KEY});

export async function POST(req: Request) {

    const reqData = await req.formData();
    const question : FormDataEntryValue = reqData.get('key');

    async function chat() {
        return groq.chat.completions.create({
            messages: [
                { role: 'user', content: `Can you only respond me with summarized title for this: ${question}, just title without "Sure" and without quotes` }
            ],
            model: 'llama3-8b-8192',
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
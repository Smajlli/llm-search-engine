import { NextResponse } from "next/server"
import { CohereClient } from "cohere-ai";
import { chatHistory } from "@/seeds";

const cohere = new CohereClient({token: process.env.COHERE_KEY});

export async function POST(req) {

    const data = await req.formData();

    const question = data.get('key');

    chatHistory.push({role: "USER", message: question});

    async function response() {
        return cohere.chat({
            chatHistory: chatHistory,
            message: question,
            connectors: [{ id: 'web-search' }]
        })
    }

    return response().then((res) => {
        return NextResponse.json(res.text)
    });
}
import { NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";
import { supabase } from "@/utils/supabase/supabase";

const cohere = new CohereClient({token: process.env.COHERE_KEY});

export async function POST(req) {

    const reqData = await req.formData();
    const question = reqData.get('key');

    async function response() {
        return cohere.chat({
            message: `Can you only respond me with summarized title for this: ${question}, just title without "Sure" and without quotes`,
            connectors: [{ id: 'web-search' }]
        })
    }

    return response().then(res => NextResponse.json(res.text));

}
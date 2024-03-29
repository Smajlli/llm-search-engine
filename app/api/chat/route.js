import { NextResponse } from "next/server"
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({token: 'RwD18OIrQqQPwjrN13RHUjQCSWMVBzm1vGIL7nED'});

export async function POST(req) {

    const data = await req.formData();

    const question = data.get('key');

    async function response() {
        return cohere.chat({
            message: question,
            connectors: [{ id: 'web-search' }]
        })
    }

    return response().then(res => NextResponse.json(res.text));
    /* return NextResponse.json({msg: 'Its workinnn'}); */
}
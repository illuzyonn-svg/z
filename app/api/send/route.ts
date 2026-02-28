import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { user, msg } = await request.json();
    
    // Token artık sadece sunucuda duruyor, tarayıcıda değil!
    const botToken = "8314569653:AAED55qPPxKwv01z_7XmXOW-Pn0M1mz1nGg";
    const chatId = "6191980329";

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `💠 NEXT_JS_SECURE_NODE\nAuth: ${user}\nPayload: ${msg}`,
            parse_mode: 'Markdown'
        })
    });

    return NextResponse.json({ success: response.ok });
}

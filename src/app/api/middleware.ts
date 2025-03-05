import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: Request){
    
    // req.body = await req.json()
    return NextResponse.next();

}

export const config = {
    matcher: '/:path*'
}
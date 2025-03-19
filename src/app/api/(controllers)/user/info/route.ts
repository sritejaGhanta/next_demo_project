import { NextRequest, NextResponse } from "next/server";
import { DefaultRespone } from "../../../../../utils/general/general";

/**
 * 
 * Get usre information
 * @param req 
 * @returns Object
 */
export function GET(req: NextRequest) {
    console.log(req['tokent_params'])
    return NextResponse.json(DefaultRespone.json());
}

/**
 * Update user information profile
 * @param req 
 * @returns 
 */
export function POST(req) {
    return NextResponse.json(DefaultRespone.json());
}
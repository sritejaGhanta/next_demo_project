import { headers } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { VerifyJWT } from './general/jwt.service';
import { DefaultResponse } from './general/general';


// This function can be marked `async` if using `await` inside
export async function ApiMiddleware(
  req: NextRequest
) {
  const authorizationToken = req.headers.get('authorization')?.split(' ')?.[1];
  const token: string = (authorizationToken && authorizationToken !== 'null') ? authorizationToken : null;
  const accessUrls: string[] = [
    "/api/custom-auth",
    "/api/auth",
  ];

  let tokenData: any = {}
  if (
      !token && 
      token !== "null" &&
      !accessUrls.some(e => req.nextUrl.pathname.indexOf(e) >= 0)
    ) {
    DefaultResponse.success = -1;
    DefaultResponse.message = "Unauthorized";
    return NextResponse.json(DefaultResponse.json(), { status: 401 })
  }

  if (token) {
    tokenData = await VerifyJWT(token);
    if (!tokenData.success) {
      DefaultResponse.success = -1;
      DefaultResponse.message = "Unauthorized";
      return NextResponse.json(DefaultResponse.json(), { status: 401 })
    }
  }
  // return NextResponse.next(tokenData.data);

  // Create a response and clone the request while modifying headers
  const response = NextResponse.next();
  if (tokenData?.data?.data) {
    response.headers.set('token_data', JSON.stringify(tokenData.data.data))
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}
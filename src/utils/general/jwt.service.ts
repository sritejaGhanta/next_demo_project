import { SignJWT, jwtVerify } from 'jose';

export async function CreateJWT(data: any) {
  const secret = new TextEncoder().encode(process.env.APP_SECRET);
  return await new SignJWT({ data })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}

export async function VerifyJWT(token: string) {
  const secret = new TextEncoder().encode(process.env.APP_SECRET);

  const result = {
    success: 0,
    data: {},
  };
  try {
    const { payload } = await jwtVerify(token, secret);
    result.success = 1;
    result.data = payload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
  }
  return result;
}
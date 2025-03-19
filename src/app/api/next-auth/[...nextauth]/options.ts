import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { SessionProvider } from 'next-auth/react';
export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRECT,
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRECT
        }),

        CredentialsProvider({
            name: "login",
            credentials: {
                email: { label: "Email", type: "text", require: true },
                password: { label: "Password", type: "text" },
            },
            async authorize(credentials, req) {
                return null;
            }
        }),
    ]
};
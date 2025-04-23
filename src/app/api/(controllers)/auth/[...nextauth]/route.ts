import nextAuth from "next-auth"
import NextAuth, { AuthOptions } from "next-auth";
import googleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
// import { Axios } from "@utils/axios/service";
import axios from 'axios';
import { API_RESPONSE } from "@utils/general/interface";
import { ROUTE } from "../../../../../utils/axios/routes";
export const authOptions: AuthOptions = {
    providers: [
        googleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRECT!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRECT
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
                let userInfo: API_RESPONSE = await axios.post(`http://localhost:3000/api/custom-auth/user/login`, credentials).then(e => e.data);
                console.log('------->', {
                    route: `http://localhost:3000/api/custom-auth/user/login`,
                    credentials,
                    userInfo
                })
                try{
                    localStorage.setItem(process.env.TOKEN, userInfo.settings.token)

                } catch (error) {
                    console.log(error)
                }
                // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
                return userInfo.settings.success ? {
                    id: userInfo.data.id,
                    user: userInfo.data,
                    token: userInfo.settings.token,
                    session: userInfo.data
                } : null;

            }
        })

    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn", { user, account, profile, email, credentials })
            return true
        },
        async redirect({ url, baseUrl }) {
            console.log("redirect", { url, baseUrl })
            return baseUrl
        },
        async session({ session, user, token }) {
            console.log("session", { session, user, token })
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            console.log("jwt", { token, user, account, profile, isNewUser })
            return token
        },
    },

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
import NextAuth, { AuthOptions } from "next-auth";
import googleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';
import { API_RESPONSE } from "@utils/general/interface";
import { CreateJWT } from "../../../general/jwt.service";
import { UserService } from "../../../services/user.service"

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
                try {
                    const userInfo: API_RESPONSE = await axios.post(`http://192.168.20.131:3000/api/custom-auth/user/login`, credentials).then(e => e.data);

                    if (userInfo.settings.success) {
                        const user = {
                            id: userInfo.data.id,
                            name: userInfo.data.first_name + ' ' + userInfo.data.last_name,
                            email: userInfo.data.email,
                            image: userInfo.data.profile,
                            ...userInfo.data,
                        };
                        user.access_token = await CreateJWT(user).then((e: any) => e.data)
                        return user; // Return the user object
                    }
                    return null; // Or throw an error for better handling
                } catch (error) {
                    console.error("Login error:", error);
                    throw new Error("Failed to login."); // Important: Throw an error on login failure
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            try {
                let checkUser: any = {}
                if (account.provider === "google" || account.provider === "github") {
                    checkUser = await UserService.getUser({
                        email: user.email
                    }) || {};
                    if (!Object.keys(checkUser).length) {
                        let info = await UserService.insertUser({
                            first_name: user.name.split(' ')[0],
                            last_name: user.name.split(' ')[1],
                            email: user.email,
                            profile: user.image,
                            password: "",
                            phone_number: "",
                            gender: "",
                            is_login: 1
                        });

                        user.first_name = checkUser.first_name;
                        user.last_name = checkUser.last_name;
                        user.email = checkUser.email;
                        user.profile = checkUser.profile;
                        user.gender = checkUser.gender;
                        user.id = info.id;
                        user.access_token = await CreateJWT(user)
                    } else {
                        user.id = checkUser.id
                        user.first_name = checkUser.first_name;
                        user.last_name = checkUser.last_name;
                        user.email = checkUser.email;
                        user.profile = checkUser.profile;
                        user.password = checkUser.password;
                        user.phone_number = checkUser.phone_number;
                        user.gender = checkUser.gender;
                        user.access_token = await CreateJWT(user)

                    }
                }
            } catch (error) {
                console.log(error)
            }
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        async session({ session, token }) {
            try {
                if (token?.user) {
                    session.user = {
                        ...session.user,
                        ...token.user
                    }
                    session.expires = new Date(Date.now() + 60 * 60 * 1000).toJSON()
                }
            } catch (error) {
                console.log(error);
            }

            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.user = user; // Attach the *entire* user object to the token
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import axiosInstance from "../utils/axios"
import { IUser } from "@/interfaces";

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: IUser & DefaultSession["user"]
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },    
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "example@domain" },
                password: { label: "Contraseña", type: "password", placeholder: "Contraseña" },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;
                try {
                    const response = await axiosInstance.post('/auth/login', {
                        email: credentials.email,
                        password: credentials.password
                    })
                    return response.data
                } catch (error) {
                    console.log(error)
                    return null;
                }
            },
        })
    ],
    
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
    },
    callbacks: {
        jwt({ token, account, user }:any){
            if ( account ) {
                switch( account.type ) {
                    case 'credentials':
                        token.user = user;
                        token.accessToken = user.token;
                        token.expiresAt = Date.now() + (2 * 24 * 60 * 60 * 1000);  
                        // Date.now() + (2 * 60 * 1000) // Expiración en 2 minutos para pruebas
                    break
                }
            }
            // Verifica si el token ha expirado
            if (Date.now() < token.expiresAt) {
                return token;  // El token sigue siendo válido
            } else {
                // El token ha expirado, lo limpiamos
                return {};
            }
        },
        session({ session, token, user }:any) {
            // Verificamos si el token ha expirado y, si es así, invalidamos la sesión
            if (token?.expiresAt && Date.now() > token.expiresAt) {
                return null;  // Invalida la sesión
            }
            return {
                ...session,
                user: token.user
            }
        },
    }
};
  
export default NextAuth(authOptions);
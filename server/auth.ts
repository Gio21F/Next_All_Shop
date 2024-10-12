import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
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
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "example@domain" },
                password: { label: "Contraseña", type: "password", placeholder: "Contraseña" },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          email: credentials.email,
                          password: credentials.password
                        })
                    });
                    if (!response.ok) {
                        // console.error("Error de autenticación:", response.statusText);
                        return null;
                    }
                    const data = await response.json();
                    return data;
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
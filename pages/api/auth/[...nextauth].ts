import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database"

export default NextAuth({
  // Configure one or more authentication providers
    providers: [
        GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        }),
        // ...add more providers here
        Credentials({
            name: "Custom Login",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "example@domain" },
                password: { label: "Contraseña", type: "password", placeholder: "Contraseña" },
            },
            async authorize(credentials) {
                try {
                    return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
                } catch (error) {
                    return null
                }
            }
        })
    ],

    // Configure custom pages
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
    },

    session: {
        maxAge: 2592000, // 30 days
        strategy: 'jwt',
        updateAge: 86400, // 1 day
    },

    // Callbacks
    callbacks: {
        async jwt({ token, account, user }) {
            if ( account ) {
                token.accesToken = account.access_token

                switch( account.type ) {
                    case 'oauth':
                        token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '', user?.image || '' )
                    break

                    case 'credentials':
                        token.user = user
                    break
                }
            }
            return token
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            session.user = token.user as any
            return session
        }
    }
})
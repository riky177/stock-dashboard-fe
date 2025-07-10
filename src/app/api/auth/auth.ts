import { fetcher } from "@/api/xhr";
import { AuthResponse, HTTPResponse, LoginCredentials } from "@type/global";
import { AuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth configuration
 */
const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  debug: process.env.NODE_ENV === "development",

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },

      async authorize(credentials): Promise<AuthResponse | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const payload: LoginCredentials = {
            email: credentials.email,
            password: credentials.password,
          };

          const response = await fetcher<HTTPResponse<AuthResponse>>("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.success || !response.data) {
            throw new Error(response.message || "Authentication failed");
          }

          const user = response.data;

          if (!user.id || !user.email || !user.role) {
            throw new Error("Invalid user data received from server");
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken: user.accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);

          if (error instanceof Error) {
            throw new Error(error.message);
          }

          throw new Error("An unexpected error occurred during authentication");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }): Promise<JWT> {
      if (trigger === "signIn" && user) {
        const authUser = user as AuthResponse;
        setTokenData(token, authUser);
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};

/**
 * Helper function to set token data from user authentication response
 */
const setTokenData = (token: JWT, userDetail: AuthResponse): void => {
  token.id = userDetail.id;
  token.email = userDetail.email;
  token.role = userDetail.role;

  if (userDetail.accessToken) {
    token.accessToken = userDetail.accessToken;
  }
};

/**
 * Get the current session (server-side only)
 * @returns Promise<Session | null>
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };

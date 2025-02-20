import type { Session } from "next-auth";
import NextAuth, { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { Provider } from "next-auth/providers";
import Spotify from "next-auth/providers/spotify";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string; // Add refreshToken to Session type
    error?: string;
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REFRESH_URL = "https://accounts.spotify.com/api/token";

// Define the custom token type
interface CustomJWT extends JWT {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  error?: string;
}

// Helper function to refresh access tokens
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(SPOTIFY_REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    if ((error as { error: string }).error === "invalid_grant") {
      return { ...token, error: "RefreshTokenRevoked" };
    }
    return { ...token, error: "RefreshTokenError" };
  }
}

const providers: Provider[] = [
  Spotify({
    authorization:
      "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public,user-top-read",
    clientId: process.env.SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
        image: profile.images?.[0]?.url || null,
      };
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
    error: "/signin", // Error code passed in query string as ?error=
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      account?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile?: any;
    }) {
      // Initial sign-in
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token, // Ensure refresh token is stored
          id: profile?.id, // Store the Spotify user ID
          name: profile?.display_name,
          email: profile?.email,
          picture: profile?.images?.[0]?.url,
        };
      }

      // Token has not expired yet
      if (Date.now() < (token as CustomJWT).accessTokenExpires) {
        return token as CustomJWT;
      }

      // Token expired, refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          id: String((token as CustomJWT).id ?? ""), // Ensure id is a string
          name: (token.name as string) ?? undefined, // Convert null to undefined
          email: (token.email as string) ?? undefined,
          image: (token.picture as string) ?? undefined,
        };
        session.accessToken = (token as CustomJWT).accessToken;
        session.refreshToken = (token as CustomJWT).refreshToken; // Include refresh token
        session.error = (token as CustomJWT).error;
      }
      return session;
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return baseUrl + "/";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add more options here if needed
});

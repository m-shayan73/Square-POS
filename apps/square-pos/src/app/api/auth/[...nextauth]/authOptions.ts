import SquareProvider from "@/providers/auth/SquareProvider";
import axios from "axios";
import type { Account, NextAuthOptions, Profile, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [SquareProvider()],
  callbacks: {
    async jwt({ token, account, profile }: { token: JWT; account: Account | null; profile?: Profile | undefined }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires_at = account.expires_at;
      }

      if (profile && "main_location_id" in profile) {
        token.locationId = profile.main_location_id as string;
      }

      // Return previous token if it's still valid
      const tokenExpiresAt = new Date(token.expires_at as string);
      if (Date.now() < tokenExpiresAt.getTime()) {
        return token;
      }

      // Access token expired, try to refresh
      async function refreshAccessToken() {
        const baseUrl = process.env.SQUARE_BASE_URL;
        const body = JSON.stringify({
          client_id: process.env.AUTH_SQUARE_ID,
          client_secret: process.env.AUTH_SQUARE_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        });

        const res = await axios.post(`${baseUrl}/oauth2/token`, body, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.status !== 200) {
          throw new Error("Failed to refresh access token");
        }

        const new_token = res.data;
        if (profile && "locationId" in profile) {
          new_token.locationId = profile.locationId as string;
        }

        return new_token;
      }

      return await refreshAccessToken();
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.locationId = token.locationId;

      return session;
    },
  },
};

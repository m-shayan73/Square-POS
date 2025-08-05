/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    locationId?: string;
  }

  interface User {
    accessToken?: string;
    locationId?: string;
  }

  interface Account {
    access_token?: string;
    refresh_token?: string;
    expires_at?: string | number;
    locationId?: string;
  }

  interface Profile {
    main_location_id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expires_at?: string | number;
    locationId?: string;
  }
}

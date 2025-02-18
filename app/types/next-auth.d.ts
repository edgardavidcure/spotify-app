import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    token?: JWT; // Add token to Session
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string; // Add access_token to JWT
  }
}

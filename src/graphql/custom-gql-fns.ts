import { gqlClient } from "@/src/graphql/setup";
import cookie from "js-cookie";

export const setAuthHeader = (token: string) => {
  gqlClient.setHeader("Authorization", `Bearer ${token}`);
};

export const request = async (query: string, variables: {} | undefined) => {
  const token =
    cookie.get(process.env.NEXT_PUBLIC_AUTHORIZATION_COOKIE_NAME as string) ||
    "";
  setAuthHeader(token);
  return gqlClient.request(query, variables).catch((err) => {
    throw err.response.errors[0].message;
  });
};

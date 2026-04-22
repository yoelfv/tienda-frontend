import { handle } from "../../dist/server/entry.mjs";

export async function onRequest(context) {
  return handle(context.request, context.env, context);
}
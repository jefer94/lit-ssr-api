import { renderLitElement } from "../utils";
import { Context } from "elysia";

export async function renderLitComponent({ body, set }: Context) {
  const [code, json, headers] = await renderLitElement(body);
  set.status = code;
  set.headers = headers;
  return json;
}

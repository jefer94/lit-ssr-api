import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HttpResponse } from "./types";

import loadModule from "./loadModule";

import { html } from "lit";

function validate(body): [number, any, Record<string, string>] | undefined {
  if (!body || Object.keys(body).length === 0) {
    return [400, { message: "body is empty", code: "no-body" }, {}];
  }

  if (body.html === undefined || body.html === "") {
    return [400, { message: "html is required", code: "no-html" }, {}];
  }

  if (
    body.dependencies === undefined ||
    !(body.dependencies instanceof Array)
  ) {
    return [
      400,
      { message: "dependencies is required", code: "no-dependencies" },
      {},
    ];
  }

  for (let dependency of body.dependencies) {
    if (dependency.code === undefined || dependency.code === "") {
      return [
        400,
        { message: "dependencies[x].code is required", code: "no-code" },
        {},
      ];
    }

    if (dependency.ext === undefined || dependency.ext === "") {
      return [
        400,
        { message: "dependencies[x].ext is required", code: "no-ext" },
        {},
      ];
    }

    if (dependency.ext !== "js" && dependency.ext !== "ts") {
      return [
        400,
        {
          message: "dependencies[x].ext must be js or ts",
          code: "invalid-ext",
        },
        {},
      ];
    }
  }
}

export async function renderLitElement(body: any): Promise<HttpResponse> {
  const error = validate(body);

  if (error) return error;

  const pending: Promise<any>[] = [];

  for (let dependency of body.dependencies) {
    const m = loadModule(dependency.code, dependency.ext);
    pending.push(m);
  }

  await Promise.all(pending);

  const template = html`${unsafeHTML(body.html)}`;
  const ssrResult = render(template);

  // status, body, headers
  return [200, { html: collectResultSync(ssrResult) }, {}];
}

import { expect, test } from "bun:test";
import fs from "fs";
import writeFile from "./writeFile";
import readFile from "./readFile";

const codeCases = [
  [
    "const a = 1",
    "/tmp/lit-ssr-api/e952cc28d614880953b984147740be15e487e5e6.ts",
  ],
  [
    "const a = 2",
    "/tmp/lit-ssr-api/088b7de89b88f6f281e3dfa65947fb55d09c6d90.ts",
  ],
  [
    "const a = 3",
    "/tmp/lit-ssr-api/0ca108409d503353dcfd57949e58d2732fa358c6.ts",
  ],
];

for (const [code, file] of codeCases) {
  test(`when writeFile('${file}', '${code}') the file is created`, async () => {
    const res = await writeFile(file, code);

    expect(res).toBeUndefined();

    const content = await readFile(file);

    expect(content).toBe(code);
    fs.rmSync(file);
  });
}

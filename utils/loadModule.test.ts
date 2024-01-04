import { expect, test } from "bun:test";
import fs from "fs";
import path from "path";
import loadModule from "./loadModule";
import sha1 from "./sha1";

const dependency = `
export default function subtract(n1: number, n2: number): number {
  return n1 - n2;
}

export function add(n1: number, n2: number): number {
  return n1 + n2;
}
`;

const addCases = [
  [1, 2, 3],
  [2, 3, 5],
  [3, 4, 7],
];
const subtractCases = [
  [1, 2, -1],
  [2, 3, -1],
  [3, 4, -1],
];

for (const [n1, n2, result] of addCases) {
  test(`loadModule('...code...', 'ts').add(${n1}, ${n2}) === ${result}`, async () => {
    const module = await loadModule(dependency, "ts");
    const res = module.add(n1, n2);

    expect(res).toBe(result);

    const hash = sha1(dependency);
    expect(
      fs.existsSync(path.resolve(`${import.meta.dir}/../tmp/${hash}.ts`))
    ).toBeTrue();
  });
}

const hash = sha1(dependency);
const file = path.resolve(`${import.meta.dir}/../tmp/${hash}.ts`);

for (const [n1, n2, result] of subtractCases) {
  test(`loadModule('...code...', 'ts').default(${n1}, ${n2}) ${result}`, async () => {
    const module = await loadModule(dependency, "ts");
    const res = module.default(n1, n2);

    expect(res).toBe(result);

    expect(fs.existsSync(file)).toBeTrue();
  });
}

const codeCases = [
  [
    "const a = 1",
    path.resolve(
      `${import.meta.dir}/../tmp/e952cc28d614880953b984147740be15e487e5e6.ts`
    ),
  ],
  [
    "const a = 2",
    path.resolve(
      `${import.meta.dir}/../tmp/088b7de89b88f6f281e3dfa65947fb55d09c6d90.ts`
    ),
  ],
  [
    "const a = 3",
    path.resolve(
      `${import.meta.dir}/../tmp/0ca108409d503353dcfd57949e58d2732fa358c6.ts`
    ),
  ],
];

for (const [code, file] of codeCases) {
  test(`when loadModule('${code}', 'ts') then ${file} exists`, async () => {
    await loadModule(code, "ts");
    expect(fs.existsSync(file)).toBeTrue();

    // get from cache
    await loadModule(code, "ts");
    expect(fs.existsSync(file)).toBeTrue();

    fs.rmSync(file);
  });
}

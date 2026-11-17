import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const lock = JSON.parse(readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));

const linuxBindings = [
  ["@esbuild/linux-x64", "esbuild"],
  ["@rolldown/binding-linux-x64-gnu", "rolldown"],
  ["@tailwindcss/oxide-linux-x64-gnu", "@tailwindcss/oxide"],
  ["lightningcss-linux-x64-gnu", "lightningcss"],
] as const;

test("Vercel Linux native build bindings match their parent packages", () => {
  for (const [binding, parent] of linuxBindings) {
    const version = lock.packages[`node_modules/${parent}`]?.version;
    assert.ok(version, `${parent} must be locked`);
    assert.equal(manifest.optionalDependencies[binding], version);
    assert.equal(lock.packages[""].optionalDependencies[binding], version);
    assert.equal(lock.packages[`node_modules/${binding}`]?.version, version);
  }

  const nestedParent = lock.packages["node_modules/@tailwindcss/node/node_modules/lightningcss"];
  const nestedBinding = lock.packages["node_modules/@tailwindcss/node/node_modules/lightningcss-linux-x64-gnu"];
  assert.equal(nestedBinding?.version, nestedParent?.version);
});

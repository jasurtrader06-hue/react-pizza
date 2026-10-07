import { readFileSync } from "node:fs";

const BASE = process.argv[2] || "https://6aaa775dff4dd5698b4e92c0.mockapi.io";
const clear = process.argv.includes("--clear");
const db = JSON.parse(readFileSync(new URL("../server/db.json", import.meta.url), "utf-8"));

async function main() {
  if (clear) {
    const old = await (await fetch(BASE + "/pizza")).json();
    for (const p of old) await fetch(BASE + "/pizza/" + p.id, { method: "DELETE" });
    console.log("Eski pitsalar o'chirildi:", old.length);
  }
  for (const p of db.pizzas) {
    const { id, ...body } = p;
    const res = await fetch(BASE + "/pizza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(res.ok ? "OK  " : "XATO", p.title);
  }
}

main().catch((e) => console.error("Xatolik:", e.message));

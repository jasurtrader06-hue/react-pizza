const BASE_URL = (
  import.meta.env.VITE_API_URL || "https://6aaa775dff4dd5698b4e92c0.mockapi.io/"
).replace(/\/$/, "");

const PIZZA_PATH = BASE_URL.includes("mockapi.io") ? "/pizza" : "/pizzas";

async function request(path, options) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (e) {
    throw new Error(
      "Serverga ulanib bo'lmadi. Backend ishlab turibdimi? (npm run server)",
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.xato || "Xatolik: " + res.status);
  return data;
}

export function fetchPizzas(options) {
  options = options || {};
  const params = [];
  if (options.category !== null && options.category !== undefined)
    params.push("category=" + options.category);
  if (options.sortBy) params.push("sortBy=" + options.sortBy);
  if (options.order) params.push("order=" + options.order);
  return request(PIZZA_PATH + "?" + params.join("&"));
}
export const createPizza = (p) =>
  request(PIZZA_PATH, { method: "POST", body: JSON.stringify(p) });
export const updatePizza = (id, p) =>
  request(PIZZA_PATH + "/" + id, { method: "PUT", body: JSON.stringify(p) });
export const deletePizza = (id) =>
  request(PIZZA_PATH + "/" + id, { method: "DELETE" });
export const createOrder = (o) =>
  request("/orders", { method: "POST", body: JSON.stringify(o) });
export const getOrders = () => request("/orders");
export const advanceOrder = (id) =>
  request("/orders/" + id + "/status", { method: "PATCH" });

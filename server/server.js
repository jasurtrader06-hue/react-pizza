const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DB = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

const read = () => JSON.parse(fs.readFileSync(DB, "utf-8"));
const save = (db) => fs.writeFileSync(DB, JSON.stringify(db, null, 2));
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;

app.get("/", (req, res) => res.json({ ok: true }));

// ---- Pitsalar ----
app.get("/pizzas", (req, res) => {
  let pizzas = read().pizzas;
  const { category, sortBy, order } = req.query;

  if (category !== undefined && category !== "") {
    pizzas = pizzas.filter((p) => String(p.category) === String(category));
  }
  if (sortBy) {
    pizzas.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) return order === "desc" ? -1 : 1;
      if (a[sortBy] < b[sortBy]) return order === "desc" ? 1 : -1;
      return 0;
    });
  }
  res.json(pizzas);
});

app.post("/pizzas", (req, res) => {
  const { title, price } = req.body;
  if (!title || !price) return res.status(400).json({ xato: "Nomi va narxi kerak" });
  const db = read();
  const pizza = {
    id: nextId(db.pizzas),
    title,
    imageUrl: req.body.imageUrl || "",
    price: Number(price),
    category: Number(req.body.category) || 0,
    rating: Number(req.body.rating) || 0,
    types: req.body.types || [0],
    sizes: req.body.sizes || [26],
  };
  db.pizzas.push(pizza);
  save(db);
  res.json(pizza);
});

app.put("/pizzas/:id", (req, res) => {
  const db = read();
  const id = Number(req.params.id);
  db.pizzas = db.pizzas.map((p) => (p.id === id ? { ...p, ...req.body, id } : p));
  save(db);
  res.json({ ok: true });
});

app.delete("/pizzas/:id", (req, res) => {
  const db = read();
  db.pizzas = db.pizzas.filter((p) => p.id !== Number(req.params.id));
  save(db);
  res.json({ ok: true });
});

// ---- Buyurtmalar ----
const SIZE_MULT = [1, 1.2, 1.4]; // frontenddagi PizzaBlock bilan bir xil

app.get("/orders", (req, res) => {
  res.json(read().orders.slice().reverse());
});

app.post("/orders", (req, res) => {
  const { name, phone, address, items } = req.body;
  if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ xato: "Ma'lumotlar to'liq emas" });
  }
  const db = read();
  const orderItems = [];
  let total = 0;
  for (const it of items) {
    const p = db.pizzas.find((x) => x.id === it.id);
    if (!p) return res.status(400).json({ xato: "Pitsa topilmadi (o'chirilgan bo'lishi mumkin)" });
    const idx = Math.max(0, p.sizes.indexOf(it.size));
    const price = Math.round(p.price * SIZE_MULT[idx]); // narxni server hisoblaydi
    const count = Math.max(1, Number(it.count) || 1);
    orderItems.push({ title: p.title, type: it.type, size: it.size, price, count });
    total += price * count;
  }
  const order = {
    id: nextId(db.orders),
    name, phone, address,
    items: orderItems,
    total,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  save(db);
  res.json(order);
});

const NEXT = { new: "delivering", delivering: "done" };

app.patch("/orders/:id/status", (req, res) => {
  const db = read();
  const order = db.orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ xato: "Buyurtma topilmadi" });
  if (NEXT[order.status]) order.status = NEXT[order.status];
  save(db);
  res.json(order);
});

app.listen(PORT, () => console.log("Server ishga tushdi: http://localhost:" + PORT));

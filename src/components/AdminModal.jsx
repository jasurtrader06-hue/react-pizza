import React, { useState, useEffect } from "react";
import {
  fetchPizzas,
  createPizza,
  updatePizza,
  deletePizza,
  getOrders,
  advanceOrder,
} from "../api/pizzaApi";
import { categories } from "./categoriesData";

const STATUS = { new: "Yangi", delivering: "Yo'lda", done: "Yetkazildi" };

function AdminModal({ onClose, onDataChanged }) {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState("pizzas");
  const [orders, setOrders] = useState([]);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(0);
  const [rating, setRating] = useState(0);
  const [types, setTypes] = useState([0]);
  const [sizes, setSizes] = useState([26]);

  const realCategories = categories.filter((c) => c.id !== null);

  async function load() {
    setLoading(true);
    try {
      setPizzas(await fetchPizzas());
      setOrders(await getOrders());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function loadOrders() {
    try {
      setOrders(await getOrders());
    } catch (e) {
      /* keyingi urinishda yangilanadi */
    }
  }

  async function nextStatus(id) {
    await advanceOrder(id);
    await loadOrders();
  }

  useEffect(() => {
    load();
    const t = setInterval(loadOrders, 5000);
    return () => clearInterval(t);
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setImageUrl("");
    setPrice("");
    setCategory(0);
    setRating(0);
    setTypes([0]);
    setSizes([26]);
  }

  function startEdit(pizza) {
    setEditingId(pizza.id);
    setTitle(pizza.title);
    setImageUrl(pizza.imageUrl);
    setPrice(pizza.price);
    setCategory(pizza.category);
    setRating(pizza.rating);
    setTypes(pizza.types);
    setSizes(pizza.sizes);
  }

  async function removePizza(id) {
    const ok = window.confirm("Bu pitsani ochirmoqchimisiz?");
    if (!ok) return;
    await deletePizza(id);
    await load();
    if (onDataChanged) onDataChanged();
  }

  function toggleType(t) {
    if (types.includes(t)) {
      setTypes(types.filter((x) => x !== t));
    } else {
      setTypes([...types, t]);
    }
  }

  function toggleSize(s) {
    if (sizes.includes(s)) {
      setSizes(sizes.filter((x) => x !== s));
    } else {
      setSizes([...sizes, s]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !price || types.length === 0 || sizes.length === 0) {
      setError("Nomi, narxi, kamida bitta tur va olcham kerak");
      return;
    }
    setError("");

    const payload = {
      title: title,
      imageUrl: imageUrl,
      price: Number(price),
      category: Number(category),
      rating: Number(rating),
      types: types,
      sizes: sizes,
    };

    if (editingId !== null) {
      await updatePizza(editingId, payload);
    } else {
      await createPizza(payload);
    }

    resetForm();
    await load();
    if (onDataChanged) onDataChanged();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Admin panel</h2>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="admin-modal__error">{error}</div>}

        <div className="admin-form__chips admin-tabs">
          <span className={tab === "pizzas" ? "chip active" : "chip"} onClick={() => setTab("pizzas")}>
            Pitsalar
          </span>
          <span className={tab === "orders" ? "chip active" : "chip"} onClick={() => setTab("orders")}>
            Buyurtmalar ({orders.length})
          </span>
        </div>

        {tab === "orders" && (
          <div className="admin-list">
            {orders.length === 0 && <p className="admin-list__hint">Hozircha buyurtmalar yo'q</p>}
            {orders.map((o) => (
              <div className="admin-list__item" key={o.id}>
                <div className="admin-list__info">
                  <b>
                    #{o.id} · {o.name} · {o.phone}
                  </b>
                  <span>{o.address}</span>
                  <span>
                    {o.items.map((i) => i.title + " " + i.size + " см ×" + i.count).join(", ")}
                  </span>
                  <span>Jami: {o.total} ₽</span>
                </div>
                <span className={"order-status order-status--" + o.status}>{STATUS[o.status]}</span>
                {o.status !== "done" && (
                  <button className="button button--pay admin-order__btn" onClick={() => nextStatus(o.id)}>
                    {o.status === "new" ? "Yo'lga chiqarish" : "Yetkazildi"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "pizzas" && (
        <>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__row">
            <input
              type="text"
              placeholder="Nomi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Narxi"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Rasm URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="admin-form__row">
            <label className="admin-form__label">
              Kategoriya
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {realCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-form__label">
              Rating
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
          </div>

          <div className="admin-form__row">
            <div>
              <div className="admin-form__mini-label">Turi</div>
              <div className="admin-form__chips">
                <span
                  className={types.includes(0) ? "chip active" : "chip"}
                  onClick={() => toggleType(0)}
                >
                  тонкое
                </span>
                <span
                  className={types.includes(1) ? "chip active" : "chip"}
                  onClick={() => toggleType(1)}
                >
                  традиционное
                </span>
              </div>
            </div>

            <div>
              <div className="admin-form__mini-label">Olcham</div>
              <div className="admin-form__chips">
                <span
                  className={sizes.includes(26) ? "chip active" : "chip"}
                  onClick={() => toggleSize(26)}
                >
                  26 см
                </span>
                <span
                  className={sizes.includes(30) ? "chip active" : "chip"}
                  onClick={() => toggleSize(30)}
                >
                  30 см
                </span>
                <span
                  className={sizes.includes(40) ? "chip active" : "chip"}
                  onClick={() => toggleSize(40)}
                >
                  40 см
                </span>
              </div>
            </div>
          </div>

          <div className="admin-form__actions">
            {editingId !== null && (
              <button
                type="button"
                className="button button--outline"
                onClick={resetForm}
              >
                Bekor qilish
              </button>
            )}
            <button type="submit" className="button button--pay">
              {editingId !== null ? "Saqlash" : "Qoshish"}
            </button>
          </div>
        </form>

        <div className="admin-list">
          {loading && <p className="admin-list__hint">Yuklanmoqda...</p>}
          {!loading &&
            pizzas.map((pizza) => (
              <div className="admin-list__item" key={pizza.id}>
                <img src={pizza.imageUrl} alt={pizza.title} />
                <div className="admin-list__info">
                  <b>{pizza.title}</b>
                  <span>{pizza.price} ₽</span>
                </div>
                <button
                  className="admin-list__edit"
                  onClick={() => startEdit(pizza)}
                >
                  ✎
                </button>
                <button
                  className="admin-list__delete"
                  onClick={() => removePizza(pizza.id)}
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

export default AdminModal;

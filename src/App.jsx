import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Categories from "./components/Categories";
import Sort from "./components/Sort";
import PizzaBlock from "./components/PizzaBlock";
import Cart from "./components/Cart";
import AdminModal from "./components/AdminModal";
import CheckoutModal from "./components/CheckoutModal";
import { fetchPizzas, createOrder } from "./api/pizzaApi";
import { sortOptions } from "./components/categoriesData";
import "./index.css";

let cartIdCounter = 1;

function App() {
  const [view, setView] = useState("menu"); // menu yoki cart
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSort, setActiveSort] = useState(sortOptions[0]);

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartItems, setCartItems] = useState([]);

  async function loadPizzas() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPizzas({
        category: activeCategory,
        sortBy: activeSort.id,
        order: activeSort.order,
      });
      setPizzas(data);
    } catch (e) {
      setError("Serverga ulanib bolmadi. Backend ishlab turibdimi?");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadPizzas();
  }, [activeCategory, activeSort]);

  function getCartCount(pizzaId) {
    let count = 0;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === pizzaId) {
        count += cartItems[i].count;
      }
    }
    return count;
  }

  function addToCart(newItem) {
    const found = cartItems.find(
      (item) =>
        item.id === newItem.id &&
        item.type === newItem.type &&
        item.size === newItem.size,
    );

    if (found) {
      const updated = cartItems.map((item) => {
        if (item.cartId === found.cartId) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
      setCartItems(updated);
    } else {
      const item = { ...newItem, cartId: cartIdCounter, count: 1 };
      cartIdCounter++;
      setCartItems([...cartItems, item]);
    }
  }

  function changeCount(cartId, count) {
    if (count < 1) return;
    const updated = cartItems.map((item) =>
      item.cartId === cartId ? { ...item, count: count } : item,
    );
    setCartItems(updated);
  }

  function removeItem(cartId) {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId));
  }

  function clearCart() {
    setCartItems([]);
  }

  function payNow() {
    setShowCheckout(true);
  }

  async function confirmOrder(customer) {
    try {
      await createOrder({
        ...customer,
        items: cartItems.map((i) => ({
          id: i.id,
          type: i.type,
          size: i.size,
          count: i.count,
        })),
      });
    } catch (e) {
      alert("Buyurtma yuborilmadi: " + e.message);
      return;
    }
    alert(
      "Rahmat, " +
        customer.name +
        "! Buyurtmangiz qabul qilindi. Jami: " +
        totalPrice +
        " ₽",
    );
    setCartItems([]);
    setShowCheckout(false);
    setView("menu");
  }

  let totalCount = 0;
  let totalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalCount += cartItems[i].count;
    totalPrice += cartItems[i].price * cartItems[i].count;
  }

  return (
    <div className="wrapper">
      <div className="container">
        <Header
          subtitle={
            view === "cart"
              ? "Самая реактивная пицца"
              : "самая вкусная пицца во вселенной"
          }
          totalPrice={totalPrice}
          totalCount={totalCount}
          onCartClick={view === "menu" ? () => setView("cart") : undefined}
          onAdminClick={() => setShowAdmin(true)}
        />

        <div className="content">
        {view === "menu" && (
          <div>
            <div className="content__top">
              <Categories
                activeCategory={activeCategory}
                onChange={setActiveCategory}
              />
              <Sort activeSort={activeSort} onChange={setActiveSort} />
            </div>

            <h2 className="content__title">Все пиццы</h2>

            {!loading && error && (
              <p className="state-msg state-msg--error">{error}</p>
            )}

            {!loading && !error && (
              <div className="pizza-grid">
                {pizzas.map((pizza) => (
                  <PizzaBlock
                    key={pizza.id}
                    pizza={pizza}
                    cartCount={getCartCount(pizza.id)}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === "cart" && (
          <Cart
            items={cartItems}
            onChangeCount={changeCount}
            onRemove={removeItem}
            onClear={clearCart}
            onBack={() => setView("menu")}
            onPay={payNow}
          />
        )}
        </div>
      </div>

      {showAdmin && (
        <AdminModal
          onClose={() => setShowAdmin(false)}
          onDataChanged={loadPizzas}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          totalPrice={totalPrice}
          onClose={() => setShowCheckout(false)}
          onConfirm={confirmOrder}
        />
      )}
    </div>
  );
}

export default App;

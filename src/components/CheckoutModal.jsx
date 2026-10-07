import React, { useState } from "react";

function CheckoutModal({ totalPrice, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !address || !phone) {
      setError("Hamma maydonlarni toldiring");
      return;
    }
    setError("");
    onConfirm({ name, address, phone });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2>Buyurtmani rasmiylashtirish</h2>
          <button className="modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="admin-modal__error">{error}</div>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ism"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Manzil"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefon raqam"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="checkout-form__total">
            Jami: <b>{totalPrice} ₽</b>
          </div>

          <button
            type="submit"
            className="button button--pay checkout-form__submit"
          >
            Buyurtma berish
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;

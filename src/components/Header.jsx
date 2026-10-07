import React from 'react';

function Header({ totalPrice, totalCount, onCartClick, onAdminClick, subtitle }) {
  return (
    <div className="header">
      <div className="header__logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M3 10 Q20 1 37 10 L20 38 Z" fill="#ffb800" stroke="#181818" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M3 10 Q20 1 37 10" stroke="#181818" strokeWidth="2.6" fill="none" />
          <circle cx="15" cy="15" r="2.8" fill="#e3401b" stroke="#181818" strokeWidth="1.2" />
          <circle cx="25" cy="15" r="2.8" fill="#e3401b" stroke="#181818" strokeWidth="1.2" />
          <circle cx="20" cy="24" r="2.8" fill="#e3401b" stroke="#181818" strokeWidth="1.2" />
        </svg>
        <div>
          <div className="header__title">REACT PIZZA</div>
          {subtitle && <div className="header__subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="header__actions">
        {onAdminClick && (
          <button className="header__admin-btn" onClick={onAdminClick} title="Admin panel">
            ⚙
          </button>
        )}
        {onCartClick && (
          <button className="header__cart-btn" onClick={onCartClick}>
            <span>{totalPrice} ₽</span>
            <span className="header__cart-divider" />
            <span className="header__cart-icon">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6.5" cy="15" r="1.2" />
                <circle cx="14" cy="15" r="1.2" />
                <path d="M1 1h2.5l1.8 9h9l1.7-6.5H4.3" />
              </svg>
              <span>{totalCount}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;

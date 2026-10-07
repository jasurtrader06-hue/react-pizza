import React from 'react';

function EmptyCart({ onBack }) {
  return (
    <div className="empty-cart">
      <h2>Корзина пустая 🙁</h2>
      <p>
        Вероятней всего, вы не заказывали ещё пиццу.
        <br />
        Для того, чтобы заказать пиццу, перейди на главную страницу.
      </p>
      <div className="empty-cart__illustration">
        <svg width="300" height="230" viewBox="0 0 300 230" fill="none">
          <path d="M60 120C50 70 90 30 150 28C215 26 250 80 240 140C232 185 170 205 120 200C80 196 66 160 60 120Z" fill="#f6f6f6" />
          <g stroke="#d6d6d6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M138 82L170 82L186 150L262 150" />
            <path d="M174 100H262M180 122H258M200 82V150M226 100V150M250 100V150" />
            <path d="M262 100L254 150" />
          </g>
          <circle cx="210" cy="170" r="8" stroke="#d0d0d0" strokeWidth="4" />
          <circle cx="250" cy="170" r="8" stroke="#d0d0d0" strokeWidth="4" />
          <path d="M138 82L120 90" stroke="#d6d6d6" strokeWidth="5" strokeLinecap="round" />
          <path d="M104 118L70 176L82 182L122 126Z" fill="#7fd3e0" />
          <path d="M104 118L146 150L156 188L168 186L160 142L130 108Z" fill="#7fd3e0" />
          <path d="M70 176L62 184L80 190L86 182Z" fill="#181818" />
          <path d="M156 188L152 198L172 200L170 186Z" fill="#181818" />
          <path d="M100 66L130 70L132 118L98 120Z" fill="#ffd98a" />
          <path d="M126 76L146 86L140 92L122 84Z" fill="#f59e7f" />
          <circle cx="110" cy="52" r="14" fill="#f59e7f" />
          <path d="M96 52C94 36 112 30 124 40C116 40 108 44 108 56Z" fill="#e8613c" />
        </svg>
      </div>
      <button className="button button--dark" onClick={onBack}>
        Вернуться назад
      </button>
    </div>
  );
}

export default EmptyCart;

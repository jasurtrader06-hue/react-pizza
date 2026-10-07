import React, { useState } from "react";
import { typeLabels } from "./categoriesData";

const sizeMultipliers = [1, 1.2, 1.4];

function PizzaBlock({ pizza, cartCount, onAdd }) {
  const [activeType, setActiveType] = useState(0);
  const [activeSize, setActiveSize] = useState(0);

  const price = Math.round(pizza.price * sizeMultipliers[activeSize]);

  const handleAdd = () => {
    onAdd({
      id: pizza.id,
      name: pizza.title,
      price,
      type: typeLabels[pizza.types[activeType]],
      size: pizza.sizes[activeSize],
      imageUrl: pizza.imageUrl,
    });
  };

  return (
    <div className="pizza-block">
      <img
        className="pizza-block__image"
        src={pizza.imageUrl}
        alt={pizza.title}
      />
      <h4 className="pizza-block__title">{pizza.title}</h4>

      <div className="pizza-block__selector">
        <ul>
          {pizza.types.map((type, i) => (
            <li
              key={type}
              className={activeType === i ? "active" : ""}
              onClick={() => setActiveType(i)}
            >
              {typeLabels[type]}
            </li>
          ))}
        </ul>
        <ul>
          {pizza.sizes.map((size, i) => (
            <li
              key={size}
              className={activeSize === i ? "active" : ""}
              onClick={() => setActiveSize(i)}
            >
              {size} см.
            </li>
          ))}
        </ul>
      </div>

      <div className="pizza-block__bottom">
        <div className="pizza-block__price">от {price} ₽</div>
        <button className="button button--add" onClick={handleAdd}>
          <span>+ Добавить</span>
          {cartCount > 0 && <i>{cartCount}</i>}
        </button>
      </div>
    </div>
  );
}

export default PizzaBlock;

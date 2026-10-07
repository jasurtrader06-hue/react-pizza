import React from "react";
import { categories } from "./categoriesData";
function Categories({ activeCategory, onChange }) {
  return (
    <ul className="categories">
      {categories.map((cat) => (
        <li
          key={cat.name}
          className={activeCategory === cat.id ? "active" : ""}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </li>
      ))}
    </ul>
  );
}

export default Categories;

import React from "react";
import "./QuantitySelector.css";


export interface QuantitySelectorProps {
  value: number;
  increase: () => void;
  decrease: () => void;
  disableIncrease?: boolean;
  disableDecrease?: boolean;
}
const QuantitySelector: React.FC<QuantitySelectorProps> = ({ value, increase, decrease, disableIncrease, disableDecrease }) => {

  return (
    <div className="quantity-selector">
      <button className="qty-btn" onClick={increase} disabled={disableIncrease}>＋</button>
      <div className="qty-display">{value}</div>
      <button className="qty-btn" onClick={decrease} disabled={disableDecrease}>-</button>
    </div>
  );
};

export default QuantitySelector;

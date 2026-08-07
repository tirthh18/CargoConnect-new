// src/utils/calculatePrice.js

const calculatePrice = (pickupCity, dropCity, weight, priority) => {
  let basePrice = 0;

  const weightPrice = {
    5: 25,
    10: 40,
    15: 60,
    20: 80,
  };

  basePrice += weightPrice[weight] || 0;

  if (pickupCity === dropCity) {
    basePrice += 40;
  } else {
    basePrice += 20;
  }
  const priorityPrice = {
    low: 0,
    high: 40,
  };

  basePrice += priorityPrice[priority] || 0;
  const gst = basePrice * 0.18;
  const insurance = 15;

  return {
    shipping: basePrice,
    gst: Number(gst.toFixed(2)),
    insurance,
    total: Number((basePrice + gst + insurance).toFixed(2)),
  };
};

export default calculatePrice;

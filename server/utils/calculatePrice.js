function calculatePrice(deliveryType, weight, priority) {
  let basePrice = 0;

  const weightPrice = {
    1: 10,
    5: 25,
    10: 40,
    15: 60,
  };

  basePrice += weightPrice[weight] || 0;

  if (deliveryType === "intercity") {
    basePrice += 40;
  } else {
    basePrice += 20;
  }

  const priorityPrice = {
    low: 0,
    high: 40,
  };

  basePrice += priorityPrice[priority] || 0;
  const insurance = 15;
  const gst = basePrice * 0.18;

  return Math.round(basePrice + gst + insurance);
}

module.exports = calculatePrice;
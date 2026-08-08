function calculatePrice(deliveryType, weight, priority) {
  let basePrice = 0;

  if (weight <= 1) {
    basePrice = 40;
  } else if (weight <= 5) {
    basePrice = 60;
  } else if (weight <= 10) {
    basePrice = 90;
  } else if (weight <= 15) {
    basePrice = 130;
  } else {
    basePrice = 130 + (weight - 15) * 15;
  }

  if (deliveryType === "local") {
    basePrice += 20;
  } else if (deliveryType === "intercity") {
    basePrice += 50;
  }

  if (priority === "high") {
    basePrice += 40;
  }

  const insurance = 15;

  const gst = (basePrice + insurance) * 0.18;

  const total = basePrice + insurance + gst;

  return Math.round(total);
}

module.exports = calculatePrice;
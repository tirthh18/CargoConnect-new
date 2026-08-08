function calculatePrice(deliveryType, weight, priority) {
  let shipping = 0;

  // Weight charge
  if (weight <= 1) {
    shipping = 40;
  } else if (weight <= 5) {
    shipping = 60;
  } else if (weight <= 10) {
    shipping = 90;
  } else if (weight <= 15) {
    shipping = 130;
  } else {
    shipping = 130 + (weight - 15) * 15;
  }

  // Delivery type charge
  if (deliveryType === "local") {
    shipping += 20;
  } else if (deliveryType === "intercity") {
    shipping += 50;
  }

  // Priority charge
  if (priority === "high") {
    shipping += 40;
  }

  // Insurance
  const insurance = 15;

  // GST
  const gst = (shipping + insurance) * 0.18;

  // Final total
  const total = shipping + insurance + gst;

  return {
    shipping: Math.round(shipping),
    gst: Math.round(gst),
    insurance,
    total: Math.round(total),
  };
}

export default calculatePrice;
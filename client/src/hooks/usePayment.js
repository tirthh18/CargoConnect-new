import { useMutation } from "@tanstack/react-query";

import { createPaymentOrder, verifyPayment } from "../services/paymentService";

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: createPaymentOrder,
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,
  });
};
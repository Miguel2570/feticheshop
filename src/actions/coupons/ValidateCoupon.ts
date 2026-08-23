"use server";

import { prisma } from "@/lib/prisma";

export async function ValidateCoupon(
  code: string,
  subtotal: number,
) {
  const coupon = await prisma.coupon.findUnique({
    where: {
      code: code.trim().toUpperCase(),
    },
  });

  if (!coupon) {
    return {
      valid: false,
      message: "Cupão inválido.",
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      message: "Este cupão está desativado.",
    };
  }

  const now = new Date();

  if (coupon.startsAt && coupon.startsAt > now) {
    return {
      valid: false,
      message: "Este cupão ainda não está disponível.",
    };
  }

  if (coupon.endsAt && coupon.endsAt < now) {
    return {
      valid: false,
      message: "Este cupão expirou.",
    };
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return {
      valid: false,
      message: "Este cupão atingiu o limite de utilizações.",
    };
  }

  if (
    coupon.minimumAmount &&
    subtotal < Number(coupon.minimumAmount)
  ) {
    return {
      valid: false,
      message: `Compra mínima de ${Number(
        coupon.minimumAmount,
      ).toFixed(2)} €`,
    };
  }

  let discount = 0;

  if (coupon.isPercentage) {
    discount =
      subtotal *
      (Number(coupon.discountValue) / 100);

    if (
      coupon.maximumDiscount &&
      discount > Number(coupon.maximumDiscount)
    ) {
      discount = Number(coupon.maximumDiscount);
    }
  } else {
    discount = Number(coupon.discountValue);
  }

  if (discount > subtotal) {
    discount = subtotal;
  }

  return {
    valid: true,

    coupon,

    discount,

    finalTotal: subtotal - discount,
  };
}
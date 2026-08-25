"use server";

import { prisma } from "@/lib/prisma";

export async function ValidateCoupon(
  code: string,
  subtotal: number,
  userId?: string,
) {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      valid: false,
      message: "Introduza um código de cupão.",
    };
  }

  if (subtotal <= 0) {
    return {
      valid: false,
      message: "O subtotal deve ser superior a 0.",
    };
  }

  const coupon = await prisma.coupon.findUnique({
    where: {
      code: normalizedCode,
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
      message:
        "Este cupão atingiu o limite de utilizações.",
    };
  }

  if (
    coupon.usagePerUser !== null &&
    userId
  ) {
    const userUsage = await prisma.order.count({
      where: {
        userId,
        couponId: coupon.id,
      },
    });

    if (userUsage >= coupon.usagePerUser) {
      return {
        valid: false,
        message:
          "Já atingiu o limite de utilizações deste cupão.",
      };
    }
  }

  if (
    coupon.minimumAmount !== null &&
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
      coupon.maximumDiscount !== null &&
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

  discount = Math.max(0, discount);

  return {
    valid: true,
    coupon,
    discount,
    finalTotal: subtotal - discount,
  };
}
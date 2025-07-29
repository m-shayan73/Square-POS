import { useCartStore } from "@/shared/providers";
import { clientApi } from "@/shared/services/clients/client-api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type { OnChangeValue } from "react-select";
import { useShallow } from "zustand/react/shallow";
import debounce from "lodash/debounce";
import usePreventBubbleScroll from "@/shared/hooks/usePreventBubbleScroll";

import type {
  CartItem,
  Discount,
  DiscountOption,
  OrderCalculationResult,
  Tax,
  TaxOption,
} from "@/shared/types";

export function useHeader() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    openCartDrawer,
    setOpenCartDrawer,
    cartDrawerRef,
    openOrderToast,
    setOpenOrderToast,
    items,
    amounts,
    isOrderCalculationLoading,
    updateQuantity,
    handleItemDiscountsChange,
    handleItemTaxesChange,
    availableDiscounts,
    availableTaxes,
    globalDiscountsApplied,
    globalTaxesApplied,
    handleGlobalDiscountsChange,
    handleGlobalTaxesChange,
    clearCart,
    handleCheckout,
  } = useCart();

  const getInitials = useCallback((name: string) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return initials.slice(0, 2);
  }, []);

  const handleLogoClick = useCallback(() => {
    router.push("/home");
  }, [router]);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const initials = useMemo(
    () => (session?.user?.name ? getInitials(session.user.name) : ""),
    [session?.user?.name, getInitials]
  );

  return {
    initials,
    handleLogoClick,
    handleSignOut,
    openCartDrawer,
    setOpenCartDrawer,
    cartDrawerRef,
    openOrderToast,
    setOpenOrderToast,
    items,
    amounts,
    isOrderCalculationLoading,
    updateQuantity,
    handleItemDiscountsChange,
    handleItemTaxesChange,
    availableDiscounts,
    availableTaxes,
    globalDiscountsApplied,
    globalTaxesApplied,
    handleGlobalDiscountsChange,
    handleGlobalTaxesChange,
    clearCart,
    handleCheckout,
  };
}

function useCart() {
  const router = useRouter();
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openOrderToast, setOpenOrderToast] = useState(false);
  const { discounts: availableDiscounts } = getDiscounts();
  const { taxes: availableTaxes } = getTaxes();

  const cartDrawerRef = useRef<HTMLDivElement>(null);

  usePreventBubbleScroll(cartDrawerRef, openCartDrawer);

  const {
    items,
    amounts,
    globalDiscountsApplied,
    globalTaxesApplied,
    updateQuantity,
    setItemDiscounts,
    setItemTaxes,
    setGlobalDiscounts,
    setGlobalTaxes,
    setCartAmounts,
    clearCart,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      amounts: state.amounts,
      globalDiscountsApplied: state.globalDiscountsApplied,
      globalTaxesApplied: state.globalTaxesApplied,
      updateQuantity: state.updateQuantity,
      setItemDiscounts: state.setItemDiscounts,
      setItemTaxes: state.setItemTaxes,
      setGlobalDiscounts: state.setGlobalDiscounts,
      setGlobalTaxes: state.setGlobalTaxes,
      setCartAmounts: state.setCartAmounts,
      clearCart: state.clearCart,
    }))
  );

  const [debouncedItems, setDebouncedItems] = useState(items);

  const debouncedSetItems = useMemo(
    () => debounce((newItems) => setDebouncedItems(newItems), 300),
    []
  );

  useEffect(() => {
    debouncedSetItems(items);
  }, [items, debouncedSetItems]);

  const { orderCalculation, isOrderCalculationLoading } =
    useOrderCalculation(debouncedItems);

  useEffect(() => {
    if (orderCalculation) {
      const { subtotal, totalTax, totalDiscount, netTotal, currency } =
        orderCalculation;

      setCartAmounts({
        subtotal,
        totalTax,
        totalDiscount,
        netTotal,
        currency,
      });
    }
  }, [orderCalculation, setCartAmounts]);

  const handleCheckout = useCallback(() => {
    setOpenCartDrawer(false);
    setOpenOrderToast(true);
  }, []);

  // Transformed for react select
  const handleItemDiscountsChange = useCallback(
    (
      itemId: string,
      variationId: string,
      newValue: OnChangeValue<DiscountOption, true>
    ) => {
      const newDiscounts = newValue.map((option) => ({
        id: option.value,
        name: option.label,
      }));
      setItemDiscounts(itemId, variationId, newDiscounts);
    },
    [setItemDiscounts]
  );

  const handleItemTaxesChange = useCallback(
    (
      itemId: string,
      variationId: string,
      newValue: OnChangeValue<TaxOption, true>
    ) => {
      const newTaxes = newValue.map((option) => ({
        id: option.value,
        name: option.label,
      }));
      setItemTaxes(itemId, variationId, newTaxes);
    },
    [setItemTaxes]
  );

  const handleGlobalDiscountsChange = useCallback(
    (newValue: OnChangeValue<DiscountOption, true>) => {
      const newGlobalDiscounts = newValue.map((option) => ({
        id: option.value,
        name: option.label,
      }));
      setGlobalDiscounts(newGlobalDiscounts);
    },
    [setGlobalDiscounts]
  );

  const handleGlobalTaxesChange = useCallback(
    (newValue: OnChangeValue<TaxOption, true>) => {
      const newGlobalTaxes = newValue.map((option) => ({
        id: option.value,
        name: option.label,
      }));
      setGlobalTaxes(newGlobalTaxes);
    },
    [setGlobalTaxes]
  );

  const transformedItems = items.map((item) => ({
    ...item,
    discountsApplied: transformToReactSelectOptions(item.discountsApplied),
    taxesApplied: transformToReactSelectOptions(item.taxesApplied),
  }));

  const transformedAvailableDiscounts = useMemo(
    () => transformToReactSelectOptions(availableDiscounts),
    [availableDiscounts]
  );

  const transformedAvailableTaxes = useMemo(
    () => transformToReactSelectOptions(availableTaxes),
    [availableTaxes]
  );

  const transformedGlobalDiscounts = useMemo(
    () => transformToReactSelectOptions(globalDiscountsApplied),
    [globalDiscountsApplied]
  );

  const transformedGlobalTaxes = useMemo(
    () => transformToReactSelectOptions(globalTaxesApplied),
    [globalTaxesApplied]
  );

  return {
    openCartDrawer,
    setOpenCartDrawer,
    cartDrawerRef,
    openOrderToast,
    setOpenOrderToast,
    items: transformedItems,
    amounts,
    isOrderCalculationLoading,
    updateQuantity,
    handleItemDiscountsChange,
    handleItemTaxesChange,
    availableDiscounts: transformedAvailableDiscounts || [],
    availableTaxes: transformedAvailableTaxes || [],
    globalDiscountsApplied: transformedGlobalDiscounts || [],
    globalTaxesApplied: transformedGlobalTaxes || [],
    handleGlobalDiscountsChange,
    handleGlobalTaxesChange,
    handleCheckout,
    clearCart,
  };
}

export function getDiscounts(): {
  discounts: Discount[];
  isLoadingDiscounts: boolean;
} {
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts"],
    queryFn: async () => {
      const response = await clientApi.get("/api/pricing/discounts/list");
      return response.data;
    },
  });

  return { discounts, isLoadingDiscounts };
}

export function getTaxes(): { taxes: Tax[]; isLoadingTaxes: boolean } {
  const { data: taxes, isLoading: isLoadingTaxes } = useQuery({
    queryKey: ["taxes"],
    queryFn: async () => {
      const response = await clientApi.get("/api/pricing/taxes/list");
      return response.data;
    },
  });

  return { taxes, isLoadingTaxes };
}

export const useOrderCalculation = (
  items: CartItem[]
): {
  orderCalculation: OrderCalculationResult | undefined;
  isOrderCalculationLoading: boolean;
} => {
  const { data, isLoading } = useQuery<OrderCalculationResult>({
    queryKey: ["order-calculation", items],
    queryFn: async () => {
      if (items.length === 0) {
        return {
          subtotal: 0,
          totalTax: 0,
          totalDiscount: 0,
          netTotal: 0,
          currency: "USD",
        } as OrderCalculationResult;
      }

      const { data } = await clientApi.post("/api/orders/calculate", {
        items,
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return {
    orderCalculation: data,
    isOrderCalculationLoading: isLoading,
  };
};

function transformToReactSelectOptions(
  items: { id: string; name: string }[]
): { value: string; label: string }[] {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item) => ({
    value: item.id,
    label: item.name,
  }));
}

import { useState } from "react";
import { useSignTypedData, useAccount } from "wagmi";

// Types based on the documentation
export interface CreateOrderParams {
  maker: string;
  makerToken: string;
  makerAmount: string;
  takerToken: string;
  takerAmount: string;
}

export interface UnsignedTypedData {
  account: string;
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
  };
  types: {
    SwapOrder: Array<{
      name: string;
      type: string;
    }>;
  };
  primaryType: "SwapOrder";
  message: {
    maker: string;
    makerToken: string;
    makerAmount: string;
    takerToken: string;
    takerAmount: string;
    salt: string;
  };
}

export interface Order {
  id: number;
  status: "PENDING_SIGNATURE" | "ACTIVE" | "FILLED" | "CANCELLED";
  maker: string;
  makerToken: string;
  makerTokenDecimals: number;
  makerAmount: string;
  taker: string | null;
  takerToken: string;
  takerTokenDecimals: number;
  takerAmount: string;
  salt: string;
  tx_hash: string | null;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SignedTypedDataResponse {
  signature: string;
  typedData: UnsignedTypedData;
}

export function useSecondaryMarket() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_OWNA_ENDPOINT_API ||
    "https://owna-backend-secondary-market-production.up.railway.app";

  // Debug: Log API base URL
  // console.log('Secondary Market API Base URL:', apiBaseUrl);

  // Create order - Step 1 of the flow
  const createOrder = async (
    params: CreateOrderParams
  ): Promise<UnsignedTypedData> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const unsignedTypedData = await response.json();
      return unsignedTypedData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign order - Step 2 of the flow
  const signOrder = async (
    unsignedTypedData: UnsignedTypedData
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const signature = await signTypedDataAsync({
        domain: {
          name: unsignedTypedData.domain.name,
          version: unsignedTypedData.domain.version,
          chainId: unsignedTypedData.domain.chainId,
          verifyingContract: unsignedTypedData.domain
            .verifyingContract as `0x${string}`,
        },
        types: {
          SwapOrder: unsignedTypedData.types.SwapOrder,
        },
        primaryType: "SwapOrder",
        message: {
          maker: unsignedTypedData.message.maker as `0x${string}`,
          makerToken: unsignedTypedData.message.makerToken as `0x${string}`,
          makerAmount: BigInt(unsignedTypedData.message.makerAmount),
          takerToken: unsignedTypedData.message.takerToken as `0x${string}`,
          takerAmount: BigInt(unsignedTypedData.message.takerAmount),
          salt: unsignedTypedData.message.salt,
        },
      });

      return signature;
    } catch (error) {
      let errorMessage = "Failed to sign order";

      // Handle user rejection of signature (following documentation)
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 4001
      ) {
        errorMessage = "User cancelled signing";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify signed order - Step 3 of the flow
  const verifyOrder = async (
    unsignedTypedData: UnsignedTypedData,
    signature: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/orders/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: unsignedTypedData,
          signature: signature,
        }),
      });

      if (!response.ok) {
        console.warn(
          `Verify API error ${response.status}: Orders verify endpoint not available`
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result; // Returns: true if valid
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to verify order";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get orders list with pagination
  const getOrders = async (
    query: PaginationQuery = {}
  ): Promise<OrdersResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.page) params.append("page", query.page.toString());
      if (query.limit) params.append("limit", query.limit.toString());

      const url = `${apiBaseUrl}/orders?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(
          `API error ${response.status}: Orders endpoint not available`
        );
        // Return empty response for graceful fallback
        return {
          data: [],
          meta: {
            total: 0,
            page: query.page || 1,
            totalPages: 0,
            limit: query.limit || 10,
          },
        };
      }

      const ordersResponse = await response.json();
      return ordersResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      console.warn("Orders API not available:", errorMessage);
      setError(errorMessage);

      // Return empty response instead of throwing to prevent infinite loops
      return {
        data: [],
        meta: {
          total: 0,
          page: query.page || 1,
          totalPages: 0,
          limit: query.limit || 10,
        },
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Execute order - Get signed typed data for on-chain execution
  const executeOrder = async (
    orderId: string
  ): Promise<SignedTypedDataResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/orders/${orderId}/execute`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const signedOrder = await response.json();
      return signedOrder;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to execute order";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete flow: Create, sign, and verify order
  const createAndVerifyOrder = async (
    params: CreateOrderParams
  ): Promise<{
    success: boolean;
    orderId?: string;
    error?: string;
  }> => {
    try {
      setError(null);

      // Step 1: Create order
      const unsignedTypedData = await createOrder(params);

      // Step 2: Sign order
      const signature = await signOrder(unsignedTypedData);

      // Step 3: Verify signature
      const isValid = await verifyOrder(unsignedTypedData, signature);

      if (isValid) {
        return {
          success: true,
          orderId: unsignedTypedData.message.salt,
        };
      } else {
        throw new Error("Order verification failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create and verify order";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    // API functions
    createOrder,
    signOrder,
    verifyOrder,
    getOrders,
    executeOrder,
    createAndVerifyOrder,

    // State
    isLoading,
    error,
    address,

    // Utilities
    clearError: () => setError(null),
  };
}

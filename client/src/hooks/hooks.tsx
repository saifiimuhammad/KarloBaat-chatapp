import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ===================== useErrors ===================== */

interface ErrorItem {
  isError: boolean;
  error?: {
    data?: {
      message?: string;
    };
  };
  fallback?: () => void;
}

const useErrors = (errors: ErrorItem[] = []): void => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (!isError) return;

      if (fallback) fallback();
      else toast.error(error?.data?.message ?? "An error occurred");
    });
  }, [errors]);
};

/* ===================== useAsyncMutation ===================== */

type RTKMutationHook<TArgs extends any[], TResult> = () => readonly [
  (...args: TArgs) => { unwrap: () => Promise<TResult> },
  any
];

const useAsyncMutation = <
  TArgs extends any[],
  TResult extends { message?: string }
>(
  mutationHook: RTKMutationHook<TArgs, TResult>
): [
  (toastMessage?: string, ...args: TArgs) => Promise<void>,
  boolean,
  TResult | null
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TResult | null>(null);

  // RTK Query returns [mutateFn, resultObj]
  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage?: string, ...args: TArgs) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage ?? "Loading...");

    try {
      // Use .unwrap() to get the data directly
      const res = await mutate(...args).unwrap();

      toast.success(res.message ?? "Updated data successfully", {
        id: toastId,
      });
      setData(res);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message ?? "An error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data] as const;
};

/* ===================== useSocketEvents ===================== */

type SocketLike = {
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
};

const useSocketEvents = (
  socket: SocketLike,
  handlers: Record<string, (...args: any[]) => void>
): void => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };

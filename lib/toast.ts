import { toast as sonnerToast, ExternalToast } from "sonner";

interface ToastOptions extends ExternalToast {
  description?: string;
}

export const toast = {
  default: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      ...options,
      description: options?.description,
    });
  },

  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
      description: options?.description,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
      description: options?.description,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
      description: options?.description,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
      description: options?.description,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
      description?: string;
    } & ToastOptions
  ) => {
    const { loading, success, error, description, ...rest } = options;
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,

      description,
      ...rest,
    });
  },
};

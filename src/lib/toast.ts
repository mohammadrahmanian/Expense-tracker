import { toast } from "sonner";

type ToastConfig = {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

export function toastSuccess(title: string, config?: ToastConfig) {
  return toast.success(title, config);
}

export function toastError(title: string, config?: ToastConfig) {
  return toast.error(title, config);
}

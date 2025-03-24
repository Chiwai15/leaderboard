import { toast } from "react-toastify";

let lastToastTime = 0;

// use case : showToastOnce("This might not be allowed", toast.warning);
export const showToastOnce = (
  message: string,
  toastFn: (msg: string) => void = toast.error // default to error
) => {
  const now = Date.now();
  if (now - lastToastTime > 1200) {
    lastToastTime = now;
    toastFn(message);
  }
};
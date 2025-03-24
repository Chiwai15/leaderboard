import { toast } from "react-toastify";
import { showToastOnce } from "./toastUtils";

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const handleApiError = (
  err: unknown,
  fallbackMsg = "Something went wrong."
) => {
  console.error("API error:", err);

  const errorData = (err as any)?.response?.data?.error;

  if (typeof errorData === "object" && errorData !== null) {
    Object.entries(errorData).forEach(([field, messages]) => {
      const label = capitalize(field);
      const text = Array.isArray(messages)
        ? messages.join(", ")
        : String(messages);
      showToastOnce(`${label}: ${text}`, toast.error);
    });
  } else {
    const msg =
      typeof errorData === "string"
        ? errorData
        : (err as any)?.message || fallbackMsg;
    showToastOnce(msg, toast.error);
  }
};

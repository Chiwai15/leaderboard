import { toast } from "react-toastify";
import { showToastOnce } from "./toastUtils";

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

interface ApiError {
  response?: {
    data?: {
      error?: string | Record<string, string[] | string>;
    };
  };
  message?: string;
}

export const handleApiError = (
  err: unknown,
  fallbackMsg = "Something went wrong."
) => {
  console.error("API error:", err);

  const error = err as ApiError;
  const errorData = error?.response?.data?.error;

  if (
    typeof errorData === "object" &&
    errorData !== null &&
    !Array.isArray(errorData)
  ) {
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
        : error?.message || fallbackMsg;
    showToastOnce(msg, toast.error);
  }
};

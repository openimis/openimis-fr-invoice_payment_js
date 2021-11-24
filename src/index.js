import messages_en from "./translations/en.json";
import flatten from "flat";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: flatten(messages_en) }],
};

export const InvoiceModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};

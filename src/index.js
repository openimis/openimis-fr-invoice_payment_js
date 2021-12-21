import messages_en from "./translations/en.json";
import reducer from "./reducer";
import flatten from "flat";
import LegalAndFinanceMainMenu from "./menus/LegalAndFinanceMainMenu";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceStatusPicker from "./pickers/InvoiceStatusPicker";
import InvoicePage from "./pages/InvoicePage";
import { InvoiceLineItemsTabLabel, InvoiceLineItemsTabPanel } from "./components/InvoiceLineItemsTab";
import { InvoicePaymentsTabLabel, InvoicePaymentsTabPanel } from "./components/InvoicePaymentsTab";

const ROUTE_INVOICES = "invoices";
const ROUTE_INVOICE = "invoices/invoice";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: flatten(messages_en) }],
  "reducers": [{ key: "invoice", reducer }],
  "core.MainMenu": [LegalAndFinanceMainMenu],
  "core.Router": [
    { path: ROUTE_INVOICES, component: InvoicesPage },
    { path: ROUTE_INVOICE + "/:invoice_uuid?", component: InvoicePage },
  ],
  "refs": [
    { key: "invoice.route.invoice", ref: ROUTE_INVOICE },
    { key: "invoice.InvoiceStatusPicker", ref: InvoiceStatusPicker },
  ],
  "invoice.TabPanel.label": [InvoiceLineItemsTabLabel, InvoicePaymentsTabLabel],
  "invoice.TabPanel.panel": [InvoiceLineItemsTabPanel, InvoicePaymentsTabPanel],
};

export const InvoiceModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};

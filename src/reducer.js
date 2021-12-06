import { formatServerError, formatGraphQLError, parseData, pageInfo } from "@openimis/fe-core";
import { REQUEST, SUCCESS, ERROR } from "./util/action-type";

export const ACTION_TYPES = {
  SEARCH_INVOICES: "INVOICE_INVOICES",
};

function reducer(
  state = {
    fetchingInvoices: false,
    errorInvoices: null,
    fetchedInvoices: false,
    invoices: [],
    invoicesPageInfo: {},
    invoicesTotalCount: 0,
  },
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: true,
        fetchedInvoices: false,
        invoices: [],
        invoicesPageInfo: {},
        invoicesTotalCount: 0,
        errorInvoices: null,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: false,
        fetchedInvoices: true,
        invoices: parseData(action.payload.data.invoice),
        invoicesPageInfo: pageInfo(action.payload.data.invoice),
        invoicesTotalCount: !!action.payload.data.invoice ? action.payload.data.invoice.totalCount : null,
        errorInvoices: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPES.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: false,
        errorInvoices: formatServerError(action.payload),
      };
    default:
      return state;
  }
}

export default reducer;

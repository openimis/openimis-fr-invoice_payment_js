import {
  formatServerError,
  formatGraphQLError,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
  parseData,
  pageInfo,
  decodeId,
} from "@openimis/fe-core";
import { REQUEST, SUCCESS, ERROR } from "./util/action-type";

export const ACTION_TYPES = {
  MUTATION: "INVOICE_MUTATION",
  SEARCH_INVOICES: "INVOICE_INVOICES",
  GET_INVOICE: "INVOICE_INVOICE",
  DELETE_INVOICE: "INVOICE_DELETE_INVOICE",
  SEARCH_INVOICE_LINE_ITEMS: "INVOICE_INVOICE_LINE_ITEMS",
};

function reducer(
  state = {
    submittingMutation: false,
    mutation: {},
    fetchingInvoices: false,
    errorInvoices: null,
    fetchedInvoices: false,
    invoices: [],
    invoicesPageInfo: {},
    invoicesTotalCount: 0,
    fetchingInvoice: false,
    errorInvoice: null,
    fetchedInvoice: false,
    invoice: null,
    fetchingInvoiceLineItems: false,
    errorInvoiceLineItems: null,
    fetchedInvoiceLineItems: false,
    invoiceLineItems: [],
    invoiceLineItemsPageInfo: {},
    invoiceLineItemsTotalCount: 0,
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
    case REQUEST(ACTION_TYPES.GET_INVOICE):
      return {
        ...state,
        fetchingInvoice: true,
        fetchedInvoice: false,
        invoice: null,
        errorInvoice: null,
      };
    case REQUEST(ACTION_TYPES.SEARCH_INVOICE_LINE_ITEMS):
      return {
        ...state,
        fetchingInvoiceLineItems: true,
        fetchedInvoiceLineItems: false,
        invoiceLineItems: [],
        invoiceLineItemsPageInfo: {},
        invoiceLineItemsTotalCount: 0,
        errorInvoiceLineItems: null,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: false,
        fetchedInvoices: true,
        invoices: parseData(action.payload.data.invoice)?.map((invoice) => ({ ...invoice, id: decodeId(invoice.id) })),
        invoicesPageInfo: pageInfo(action.payload.data.invoice),
        invoicesTotalCount: !!action.payload.data.invoice ? action.payload.data.invoice.totalCount : null,
        errorInvoices: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPES.GET_INVOICE):
      return {
        ...state,
        fetchingInvoice: false,
        fetchedInvoice: true,
        invoice: parseData(action.payload.data.invoice)?.[0],
        errorInvoice: null,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_INVOICE_LINE_ITEMS):
      return {
        ...state,
        fetchingInvoiceLineItems: false,
        fetchedInvoiceLineItems: true,
        invoiceLineItems: parseData(action.payload.data.invoiceLineItem)?.map((invoiceLineItem) => ({
          ...invoiceLineItem,
          id: decodeId(invoiceLineItem.id),
        })),
        invoiceLineItemsPageInfo: pageInfo(action.payload.data.invoiceLineItem),
        invoiceLineItemsTotalCount: action.payload.data.invoiceLineItem?.totalCount,
        errorInvoiceLineItems: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPES.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: false,
        errorInvoices: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPES.GET_INVOICE):
      return {
        ...state,
        fetchingInvoice: false,
        errorInvoice: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPES.SEARCH_INVOICE_LINE_ITEMS):
      return {
        ...state,
        fetchingInvoiceLineItems: false,
        errorInvoiceLineItems: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPES.MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPES.MUTATION):
      return dispatchMutationErr(state, action);
    case SUCCESS(ACTION_TYPES.DELETE_INVOICE):
      return dispatchMutationResp(state, "deleteInvoice", action);
    default:
      return state;
  }
}

export default reducer;

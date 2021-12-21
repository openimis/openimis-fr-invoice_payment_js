import { STATUS_PREFIX_LENGTH } from "../constants";

export const getInvoiceStatus = (invoice) => invoice?.status?.substring(STATUS_PREFIX_LENGTH);

export const getInvoicePaymentStatus = (invoicePayment) => invoicePayment?.status?.substring(STATUS_PREFIX_LENGTH);

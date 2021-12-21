import { graphql, formatPageQuery, formatPageQueryWithCount, formatMutation } from "@openimis/fe-core";
import { ACTION_TYPES } from "./reducer";
import { ERROR, REQUEST, SUCCESS } from "./util/action-type";

const INVOICE_FULL_PROJECTION = [
  "id",
  "isDeleted",
  "jsonExt",
  "dateCreated",
  "dateUpdated",
  "dateValidFrom",
  "dateValidTo",
  "replacementUuid",
  "thirdpartyType",
  "thirdpartyTypeName",
  "thirdpartyId",
  "thirdparty",
  "codeTp",
  "code",
  "codeExt",
  "dateDue",
  "datePayed",
  "amountDiscount",
  "amountNet",
  "amountTotal",
  "taxAnalysis",
  "status",
  "currencyTpCode",
  "currencyCode",
  "note",
  "terms",
  "paymentReference",
  "subjectType",
  "subjectTypeName",
  "subjectId",
  "subject",
  "dateInvoice",
];

const INVOICE_LINE_ITEM_FULL_PROJECTION = [
  "id",
  "code",
  "description",
  "ledgerAccount",
  "quantity",
  "unitPrice",
  "discount",
  "deduction",
  "amountTotal",
  "amountNet",
  "taxAnalysis",
];

const INVOICE_PAYMENT_FULL_PROJECTION = [
  "id",
  "status",
  "codeExt",
  "label",
  "codeTp",
  "codeReceipt",
  "amountPayed",
  "fees",
  "amountReceived",
  "datePayment",
  "paymentOrigin",
];

const formatInvoicePaymentGQL = (payment) =>
  `
    ${!!payment.id ? `id: "${payment.id}"` : ""}
    ${!!payment.invoiceId ? `invoiceId: "${payment.invoiceId}"` : ""}
    ${!!payment.status ? `status: ${payment.status}` : ""}
    ${!!payment.codeExt ? `codeExt: "${payment.codeExt}"` : ""}
    ${!!payment.label ? `label: "${payment.label}"` : ""}
    ${!!payment.codeTp ? `codeTp: "${payment.codeTp}"` : ""}
    ${!!payment.codeReceipt ? `codeReceipt: "${payment.codeReceipt}"` : ""}
    ${!!payment.amountPayed ? `amountPayed: "${payment.amountPayed}"` : ""}
    ${!!payment.fees ? `fees: "${payment.fees}"` : ""}
    ${!!payment.amountReceived ? `amountReceived: "${payment.amountReceived}"` : ""}
    ${!!payment.datePayment ? `datePayment: "${payment.datePayment}"` : ""}
    ${!!payment.paymentOrigin ? `paymentOrigin: "${payment.paymentOrigin}"` : ""}
  `;

export function fetchInvoices(params) {
  const payload = formatPageQueryWithCount("invoice", params, INVOICE_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPES.SEARCH_INVOICES);
}

export function fetchInvoice(params) {
  const payload = formatPageQuery("invoice", params, INVOICE_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPES.GET_INVOICE);
}

export function fetchInvoiceLineItems(params) {
  const payload = formatPageQueryWithCount("invoiceLineItem", params, INVOICE_LINE_ITEM_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPES.SEARCH_INVOICE_LINE_ITEMS);
}

export function fetchInvoicePayments(params) {
  const payload = formatPageQueryWithCount("invoicePayment", params, INVOICE_PAYMENT_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPES.SEARCH_INVOICE_PAYMENTS);
}

export function deleteInvoice(invoice, clientMutationLabel) {
  const invoiceUuids = `uuids: ["${invoice?.id}"]`;
  const mutation = formatMutation("deleteInvoice", invoiceUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(mutation.payload, [REQUEST(ACTION_TYPES.MUTATION), SUCCESS(ACTION_TYPES.DELETE_INVOICE), ERROR(ACTION_TYPES.MUTATION)], {
    actionType: ACTION_TYPES.DELETE_INVOICE,
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,
  });
}

export function createInvoicePayment(invoicePayment, clientMutationLabel) {
  const mutation = formatMutation("createInvoicePayment", formatInvoicePaymentGQL(invoicePayment), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPES.MUTATION), SUCCESS(ACTION_TYPES.CREATE_INVOICE_PAYMENT), ERROR(ACTION_TYPES.MUTATION)],
    {
      actionType: ACTION_TYPES.CREATE_INVOICE_PAYMENT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateInvoicePayment(invoicePayment, clientMutationLabel) {
  const mutation = formatMutation("updateInvoicePayment", formatInvoicePaymentGQL(invoicePayment), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPES.MUTATION), SUCCESS(ACTION_TYPES.UPDATE_INVOICE_PAYMENT), ERROR(ACTION_TYPES.MUTATION)],
    {
      actionType: ACTION_TYPES.UPDATE_INVOICE_PAYMENT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function deleteInvoicePayment(invoicePayment, clientMutationLabel) {
  const invoicePaymentUuids = `uuids: ["${invoicePayment?.id}"]`;
  const mutation = formatMutation("deleteInvoicePayment", invoicePaymentUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPES.MUTATION), SUCCESS(ACTION_TYPES.DELETE_INVOICE_PAYMENT), ERROR(ACTION_TYPES.MUTATION)],
    {
      actionType: ACTION_TYPES.DELETE_INVOICE_PAYMENT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

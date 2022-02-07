import { graphql, formatPageQuery, formatPageQueryWithCount, formatMutation } from "@openimis/fe-core";
import { ACTION_TYPE } from "./reducer";
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

const BILL_FULL_PROJECTION = [
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
  "dateBill",
];

const INVOICE_EVENT_FULL_PROJECTION = ["eventType", "message"];

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

const formatInvoiceEventMessageGQL = (eventMessage) =>
  `
    ${!!eventMessage.invoiceId ? `invoiceId: "${eventMessage.invoiceId}"` : ""}
    ${!!eventMessage.eventType ? `eventType: ${eventMessage.eventType}` : ""}
    ${!!eventMessage.message ? `message: "${eventMessage.message}"` : ""}
  `;

export function fetchInvoices(params) {
  const payload = formatPageQueryWithCount("invoice", params, INVOICE_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.SEARCH_INVOICES);
}

export function fetchInvoice(params) {
  const payload = formatPageQuery("invoice", params, INVOICE_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.GET_INVOICE);
}

export function fetchInvoiceLineItems(params) {
  const payload = formatPageQueryWithCount("invoiceLineItem", params, INVOICE_LINE_ITEM_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.SEARCH_INVOICE_LINE_ITEMS);
}

export function fetchInvoicePayments(params) {
  const payload = formatPageQueryWithCount("invoicePayment", params, INVOICE_PAYMENT_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.SEARCH_INVOICE_PAYMENTS);
}

export function fetchInvoiceEvents(params) {
  const payload = formatPageQueryWithCount("invoiceEvent", params, INVOICE_EVENT_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.SEARCH_INVOICE_EVENTS);
}

export function deleteInvoice(invoice, clientMutationLabel) {
  const invoiceUuids = `uuids: ["${invoice?.id}"]`;
  const mutation = formatMutation("deleteInvoice", invoiceUuids, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_INVOICE), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_INVOICE,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function createInvoicePayment(invoicePayment, clientMutationLabel) {
  const mutation = formatMutation("createInvoicePayment", formatInvoicePaymentGQL(invoicePayment), clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_INVOICE_PAYMENT), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_INVOICE_PAYMENT,
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
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_INVOICE_PAYMENT), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.UPDATE_INVOICE_PAYMENT,
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
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_INVOICE_PAYMENT), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_INVOICE_PAYMENT,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function createInvoiceEventMessage(invoiceEvent, clientMutationLabel) {
  const mutation = formatMutation(
    "createInvoiceEventMessage",
    formatInvoiceEventMessageGQL(invoiceEvent),
    clientMutationLabel,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_INVOICE_EVENT_MESSAGE), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_INVOICE_EVENT_MESSAGE,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

//bill 
export function fetchBills(params) {
  const payload = formatPageQueryWithCount("bill", params, BILL_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPE.SEARCH_BILLS);
}

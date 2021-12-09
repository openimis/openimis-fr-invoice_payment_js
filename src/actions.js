import { graphql, formatPageQuery, formatPageQueryWithCount, formatMutation } from "@openimis/fe-core";
import { ACTION_TYPES } from "./reducer";

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

export function fetchInvoices(params) {
  const payload = formatPageQueryWithCount("invoice", params, INVOICE_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPES.SEARCH_INVOICES);
}

export function fetchInvoice(params) {
  const payload = formatPageQuery("invoice", params, INVOICE_FULL_PROJECTION);
  return graphql(payload, ACTION_TYPES.GET_INVOICE);
}

export function deleteInvoice(invoice, clientMutationLabel, clientMutationDetails = null) {
  const invoiceUuids = `uuids: ["${invoice?.id}"]`;
  const mutation = formatMutation("deleteInvoice", invoiceUuids, clientMutationLabel, clientMutationDetails);
  const requestedDateTime = new Date();
  return graphql(
      mutation.payload,
      ["INVOICE_MUTATION_REQ", "INVOICE_DELETE_INVOICE_RESP", "INVOICE_MUTATION_ERR"],
      {
          clientMutationId: mutation.clientMutationId,
          clientMutationLabel,
          requestedDateTime
      }
  );
}

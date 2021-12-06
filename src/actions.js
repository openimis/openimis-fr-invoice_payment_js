import { graphql, formatPageQueryWithCount } from "@openimis/fe-core";
import { ACTION_TYPES } from "./reducer";

const INVOICE_FULL_PROJECTION = () => [
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
  const payload = formatPageQueryWithCount("invoice", params, INVOICE_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPES.SEARCH_INVOICES);
}

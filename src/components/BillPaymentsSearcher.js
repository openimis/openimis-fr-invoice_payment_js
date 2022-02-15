import React from "react";
import { injectIntl } from "react-intl";
import {
  formatMessage,
  formatMessageWithValues,
  Searcher,
  withHistory,
  formatDateFromISO,
  withModulesManager,
  coreConfirm,
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchBillPayments } from "../actions";
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "../constants";
import { Tooltip } from "@material-ui/core";
import BillPaymentsFilter from "./BillPaymentsFilter";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker"
import DeleteIcon from "@material-ui/icons/Delete";
import { ACTION_TYPES } from "../reducer";

const BillPaymentsSearcher = ({
  intl,
  modulesManager,
  rights,
  bill,
  setConfirmedAction,
  deleteBillPaymentPayment,
  submittingMutation,
  mutation,
  coreConfirm,
  confirmed,

  fetchBillPayments,
  fetchingBillPayments,
  fetchedBillPayments,
  errorBillPayments,
  billPayments,
  billPaymentsPageInfo,
  billPaymentsTotalCount,
}) => {
  const fetch = (params) => fetchBillPayments(params);

  const headers = () => [
    "billPayment.status.label",
    "billPayment.codeExt",
    "billPayment.label",
    "billPayment.codeTp",
    "billPayment.codeReceipt",
    "billPayment.amountPayed",
    "billPayment.fees",
    "billPayment.amountReceived",
    "billPayment.datePayment",
    "billPayment.paymentOrigin",
  ];

  const itemFormatters = () => [
    (billPayment) => <InvoicePaymentStatusPicker value={billPayment?.status} readOnly />,
    (billPayment) => billPayment.codeExt,
    (billPayment) => billPayment.label,
    (billPayment) => billPayment.codeTp,
    (billPayment) => billPayment.codeReceipt,
    (billPayment) => billPayment.amountPayed,
    (billPayment) => billPayment.fees,
    (billPayment) => billPayment.amountReceived,
    (billPayment) => billPayment.datePayment,
    (billPayment) =>
        !!billPayment.datePayment
          ? formatDateFromISO(modulesManager, intl, billPayment.datePayment)
          : EMPTY_STRING,
      (billPayment) => billPayment.paymentOrigin,
  ];

  const sorts = () => [
    ["status", true],
    ["codeExt", true],
    ["label", true],
    ["codeTp", true],
    ["codeReceipt", true],
    ["amountPayed", true],
    ["fees", true],
    ["amountReceived", true],
    ["datePayment", true],
    ["paymentOrigin", true],
  ];

  const defaultFilters = () => ({
    bill_Id: {
      value: bill?.id,
      filter: `bill_Id: "${bill?.id}"`,
    },
    isDeleted: {
      value: false,
      filter: "isDeleted: false",
    },
  });

  return (
    !!bill?.id && (
      <Searcher
        module="bill"
        FilterPane={BillPaymentsFilter}
        fetch={fetch}
        items={billPayments}
        itemsPageInfo={billPaymentsPageInfo}
        fetchingItems={fetchingBillPayments}
        fetchedItems={fetchedBillPayments}
        errorItems={errorBillPayments}
        tableTitle={formatMessageWithValues(intl, "invoice", "billPayments.searcherResultsTitle", {
          billPaymentsTotalCount,
        })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="id"
        defaultFilters={defaultFilters()}
      />
    )
  );
};

const mapStateToProps = (state) => ({
  fetchingBillPayments: state.invoice.fetchingBillPayments,
  fetchedBillPayments: state.invoice.fetchedBillPayments,
  errorBillPayments: state.invoice.errorBillPayments,
  billPayments: state.invoice.billPayments,
  billPaymentsPageInfo: state.invoice.billPaymentsPageInfo,
  billPaymentsTotalCount: state.invoice.billPaymentsTotalCount,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchBillPayments,
    },
    dispatch,
  );
};

export default withHistory(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BillPaymentsSearcher)));

import React, { useRef, useEffect, useState } from "react";
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
import { fetchInvoicePayments, deleteInvoicePayment } from "../actions";
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_STRING,
  RIGHT_INVOICE_PAYMENT_DELETE,
  RIGHT_INVOICE_PAYMENT_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
} from "../constants";
import InvoicePaymentsFilter from "./InvoicePaymentsFilter";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker";
import { getInvoicePaymentStatus } from "../util/status";
import UpdateInvoicePaymentDialog from "../dialogs/InvoicePaymentDialog";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ACTION_TYPES } from "../reducer";

const InvoicePaymentsSearcher = ({
  intl,
  modulesManager,
  rights,
  invoice,
  setConfirmedAction,
  deleteInvoicePayment,
  submittingMutation,
  mutation,
  coreConfirm,
  confirmed,
  fetchInvoicePayments,
  fetchingInvoicePayments,
  fetchedInvoicePayments,
  errorInvoicePayments,
  invoicePayments,
  invoicePaymentsPageInfo,
  invoicePaymentsTotalCount,
}) => {
  const [queryParams, setQueryParams] = useState([]);
  const [invoicePaymentToDelete, setInvoicePaymentToDelete] = useState(null);
  const [deletedInvoicePaymentUuids, setDeletedInvoicePaymentUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => invoicePaymentToDelete && openDeleteInvoicePaymentConfirmDialog(), [invoicePaymentToDelete]);

  useEffect(() => {
    if (invoicePaymentToDelete && confirmed) {
      setDeletedInvoicePaymentUuids([...deletedInvoicePaymentUuids, invoicePaymentToDelete.id]);
    }
    invoicePaymentToDelete && confirmed !== null && setInvoicePaymentToDelete(null);
  }, [confirmed]);

  useEffect(() => {
    if (
      prevSubmittingMutationRef.current &&
      !submittingMutation &&
      [ACTION_TYPES.CREATE_INVOICE_PAYMENT, ACTION_TYPES.UPDATE_INVOICE_PAYMENT].includes(mutation?.actionType)
    ) {
      refetch();
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const deleteInvoicePaymentCallback = () =>
    deleteInvoicePayment(
      invoicePaymentToDelete,
      formatMessageWithValues(intl, "invoice", "invoicePayment.delete.mutationLabel", {
        invoicePaymentLabel: invoicePaymentToDelete?.label,
        invoiceCode: invoice?.code,
      }),
    );

  const openDeleteInvoicePaymentConfirmDialog = () => {
    setConfirmedAction(() => deleteInvoicePaymentCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "invoicePayment.delete.confirm.title", {
        invoicePaymentLabel: invoicePaymentToDelete?.label,
      }),
      formatMessage(intl, "invoice", "invoicePayment.delete.confirm.message"),
    );
  };

  const onDelete = (invoicePayment) => setInvoicePaymentToDelete(invoicePayment);

  const fetch = (params) => fetchInvoicePayments(params);

  const refetch = () => fetch(queryParams);

  const filtersToQueryParams = ({ filters, pageSize, beforeCursor, afterCursor, orderBy }) => {
    const queryParams = Object.keys(filters)
      .filter((f) => !!filters[f]["filter"])
      .map((f) => filters[f]["filter"]);
    pageSize && queryParams.push(`first: ${pageSize}`);
    beforeCursor && queryParams.push(`before: "${beforeCursor}"`);
    afterCursor && queryParams.push(`after: "${afterCursor}"`);
    orderBy && queryParams.push(`orderBy: ["${orderBy}"]`);
    setQueryParams(queryParams);
    return queryParams;
  };

  const headers = () => [
    "invoicePayment.status.label",
    "invoicePayment.codeExt",
    "invoicePayment.label",
    "invoicePayment.codeTp",
    "invoicePayment.codeReceipt",
    "invoicePayment.amountPayed",
    "invoicePayment.fees",
    "invoicePayment.amountReceived",
    "invoicePayment.datePayment",
    "invoicePayment.paymentOrigin",
  ];

  const itemFormatters = () => {
    const formatters = [
      (invoicePayment) => <InvoicePaymentStatusPicker value={invoicePayment?.status} readOnly />,
      (invoicePayment) => invoicePayment.codeExt,
      (invoicePayment) => invoicePayment.label,
      (invoicePayment) => invoicePayment.codeTp,
      (invoicePayment) => invoicePayment.codeReceipt,
      (invoicePayment) => invoicePayment.amountPayed,
      (invoicePayment) => invoicePayment.fees,
      (invoicePayment) => invoicePayment.amountReceived,
      (invoicePayment) =>
        !!invoicePayment.datePayment
          ? formatDateFromISO(modulesManager, intl, invoicePayment.datePayment)
          : EMPTY_STRING,
      (invoicePayment) => invoicePayment.paymentOrigin,
    ];
    if (rights.includes(RIGHT_INVOICE_PAYMENT_UPDATE)) {
      formatters.push((invoicePayment) => (
        <UpdateInvoicePaymentDialog
          invoice={invoice}
          invoicePayment={invoicePayment}
          disabled={deletedInvoicePaymentUuids.includes(invoicePayment.id)}
        />
      ));
    }
    if (rights.includes(RIGHT_INVOICE_PAYMENT_DELETE)) {
      formatters.push((invoicePayment) => (
        <Tooltip title={formatMessage(intl, "invoice", "deleteButtonTooltip")}>
          <IconButton
            onClick={() => onDelete(invoicePayment)}
            disabled={deletedInvoicePaymentUuids.includes(invoicePayment.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

  const sorts = () => [
    ["code", true],
    ["description", true],
    ["ledgerAccount", true],
    ["quantity", true],
    ["unitPrice", true],
    ["discount", true],
    ["deduction", true],
    ["amountTotal", true],
    ["amountNet", true],
  ];

  const defaultFilters = () => ({
    invoice_Id: {
      value: invoice?.id,
      filter: `invoice_Id: "${invoice?.id}"`,
    },
    isDeleted: {
      value: false,
      filter: "isDeleted: false",
    },
  });

  const isRowDisabled = (_, invoicePayment) => deletedInvoicePaymentUuids.includes(invoicePayment.id);

  return (
    !!invoice?.id && (
      <Searcher
        module="invoice"
        FilterPane={InvoicePaymentsFilter}
        fetch={fetch}
        items={invoicePayments}
        itemsPageInfo={invoicePaymentsPageInfo}
        fetchingItems={fetchingInvoicePayments}
        fetchedItems={fetchedInvoicePayments}
        errorItems={errorInvoicePayments}
        tableTitle={formatMessageWithValues(intl, "invoice", "invoicePayments.searcherResultsTitle", {
          invoicePaymentsTotalCount,
        })}
        filtersToQueryParams={filtersToQueryParams}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="id"
        defaultFilters={defaultFilters()}
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
      />
    )
  );
};

const mapStateToProps = (state) => ({
  fetchingInvoicePayments: state.invoice.fetchingInvoicePayments,
  fetchedInvoicePayments: state.invoice.fetchedInvoicePayments,
  errorInvoicePayments: state.invoice.errorInvoicePayments,
  invoicePayments: state.invoice.invoicePayments?.map((invoicePayment) => ({
    ...invoicePayment,
    status: getInvoicePaymentStatus(invoicePayment),
  })),
  invoicePaymentsPageInfo: state.invoice.invoicePaymentsPageInfo,
  invoicePaymentsTotalCount: state.invoice.invoicePaymentsTotalCount,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchInvoicePayments,
      deleteInvoicePayment,
      coreConfirm,
    },
    dispatch,
  );
};

export default withModulesManager(
  withHistory(injectIntl(connect(mapStateToProps, mapDispatchToProps)(InvoicePaymentsSearcher))),
);

import React, { useRef, useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import {
  formatMessage,
  formatMessageWithValues,
  Searcher,
  formatDateFromISO,
  withModulesManager,
  coreConfirm,
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchBillPayments, deleteBillPayment } from "../actions";
import {
  DEFAULT_PAGE_SIZE,
  EMPTY_STRING,
  RIGHT_BILL_PAYMENT_DELETE,
  RIGHT_BILL_PAYMENT_UPDATE,
  ROWS_PER_PAGE_OPTIONS,
} from "../constants";
import BillPaymentsFilter from "./BillPaymentsFilter";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker"
import UpdateBillPaymentDialog from "../dialogs/BillPaymentDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton, Tooltip } from "@material-ui/core";
import { ACTION_TYPE } from "../reducer";

const BillPaymentsSearcher = ({
  intl,
  modulesManager,
  rights,
  bill,
  setConfirmedAction,
  deleteBillPayment,
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
  const [queryParams, setQueryParams] = useState([]);
  const [billPaymentToDelete, setBillPaymentToDelete] = useState(null);
  const [deletedBillPaymentUuids, setDeletedBillPaymentUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => billPaymentToDelete && openDeleteBillPaymentConfirmDialog(), [billPaymentToDelete]);

  useEffect(() => {
    if (billPaymentToDelete && confirmed) {
      setDeletedBillPaymentUuids([...deletedBillPaymentUuids, billPaymentToDelete.id]);
    }
    billPaymentToDelete && confirmed !== null && setBillPaymentToDelete(null);
  }, [confirmed]);

  useEffect(() => {
    if (
      prevSubmittingMutationRef.current &&
      !submittingMutation &&
      [ACTION_TYPE.CREATE_BILL_PAYMENT, ACTION_TYPE.UPDATE_BILL_PAYMENT].includes(mutation?.actionType)
    ) {
      refetch();
    }
  }, [submittingMutation]);
  
  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const deleteBillPaymentCallback = () =>
    deleteBillPayment(
      billPaymentToDelete,
      formatMessageWithValues(intl, "invoice", "billPayment.delete.mutationLabel", {
        billPaymentLabel: billPaymentToDelete?.label,
        billCode: bill?.code,
      }),
    );

  const openDeleteBillPaymentConfirmDialog = () => {
    setConfirmedAction(() => deleteBillPaymentCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "billPayment.delete.confirm.title", {
        billPaymentLabel: billPaymentToDelete?.label,
      }),
      formatMessage(intl, "invoice", "billPayment.delete.confirm.message"),
    );
  };

  const onDelete = (billPayment) => setBillPaymentToDelete(billPayment);

  const fetch = (params) => fetchBillPayments(params);

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

  const itemFormatters = () => {
    const formatters = [
      (billPayment) => <InvoicePaymentStatusPicker value={billPayment?.status} readOnly />,
      (billPayment) => billPayment.codeExt,
      (billPayment) => billPayment.label,
      (billPayment) => billPayment.codeTp,
      (billPayment) => billPayment.codeReceipt,
      (billPayment) => billPayment.amountPayed,
      (billPayment) => billPayment.fees,
      (billPayment) => billPayment.amountReceived,
      (billPayment) =>
        !!billPayment.datePayment
          ? formatDateFromISO(modulesManager, intl, billPayment.datePayment)
          : EMPTY_STRING,
      (billPayment) => billPayment.paymentOrigin,
    ];
    if (rights.includes(RIGHT_BILL_PAYMENT_UPDATE)) {
      formatters.push((billPayment) => (
        <UpdateBillPaymentDialog
          bill={bill}
          billPayment={billPayment}
          disabled={deletedBillPaymentUuids.includes(billPayment.id)}
        />
      ));
    }
    if (rights.includes(RIGHT_BILL_PAYMENT_DELETE)) {
      formatters.push((billPayment) => (
        <Tooltip title={formatMessage(intl, "invoice", "deleteButtonTooltip")}>
          <IconButton
            onClick={() => onDelete(billPayment)}
            disabled={deletedBillPaymentUuids.includes(billPayment.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

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

  const isRowDisabled = (_, billPayment) => deletedBillPaymentUuids.includes(billPayment.id);

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
        filtersToQueryParams={filtersToQueryParams}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="codeExt"
        defaultFilters={defaultFilters()}
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
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
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchBillPayments,
      deleteBillPayment,
      coreConfirm
    },
    dispatch,
  );
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BillPaymentsSearcher)));

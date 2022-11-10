import React, { useState, useCallback, useEffect, useRef } from "react";
import { injectIntl } from "react-intl";
import {
  withModulesManager,
  formatMessage,
  formatMessageWithValues,
  Searcher,
  formatDateFromISO,
  coreConfirm,
  journalize,
  withHistory,
  historyPush,
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchBills, deleteBill } from "../actions";
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
  EMPTY_STRING,
  RIGHT_BILL_UPDATE,
  RIGHT_BILL_DELETE,
  STATUS,
} from "../constants";
import BillFilter from "./BillFilter";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import { getSubjectAndThirdpartyTypePicker } from "../util/subject-and-thirdparty-picker";
import { IconButton, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const BillSearcher = ({
  intl,
  modulesManager,
  history,
  rights,
  coreConfirm,
  confirmed,
  journalize,
  submittingMutation,
  mutation,
  fetchBills,
  deleteBill,
  fetchingBills,
  fetchedBills,
  errorBills,
  bills,
  billsPageInfo,
  billsTotalCount,
  actions,
  actionsContributionKey
}) => {
  const [billToDelete, setBillToDelete] = useState(null);
  const [deletedBillUuids, setDeletedBillUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => billToDelete && openConfirmDialog(), [billToDelete]);

  useEffect(() => {
    if (billToDelete && confirmed) {
      confirmedAction();
      setDeletedBillUuids([...deletedBillUuids, billToDelete.id]);
    }
    billToDelete && confirmed !== null && setBillToDelete(null);
  }, [confirmed]);

  useEffect(() => {
    prevSubmittingMutationRef.current && !submittingMutation && journalize(mutation);
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const confirmedAction = useCallback(
    () =>
      deleteBill(
        billToDelete,
        formatMessageWithValues(intl, "bill", "delete.mutationLabel", {
          code: billToDelete.code,
        }),
      ),
    [billToDelete],
  );

  const openConfirmDialog = useCallback(
    () =>
      coreConfirm(
        formatMessageWithValues(intl, "bill", "delete.confirm.title", {
          code: billToDelete.code,
        }),
        formatMessage(intl, "bill", "delete.confirm.message"),
      ),
    [billToDelete],
  ); 

  const fetch = (params) => fetchBills(params);

  const headers = () => {
    const headers = [
      "bill.subject",
      "bill.thirdparty",
      "bill.code",
      "bill.dateBill",
      "bill.amountTotal",
      "bill.status.label",
    ];
    if (rights.includes(RIGHT_BILL_UPDATE)) {
      headers.push("emptyLabel");
    }
    return headers;
  };

  const itemFormatters = () => {
    const formatters = [
      (bill) => getSubjectAndThirdpartyTypePicker(modulesManager, bill.subjectTypeName, bill.subject),
      (bill) => getSubjectAndThirdpartyTypePicker(modulesManager, bill.thirdpartyTypeName, bill.thirdparty),
      (bill) => bill.code,
      (bill) =>
        !!bill.dateBill ? formatDateFromISO(modulesManager, intl, bill.dateBill) : EMPTY_STRING,
      (bill) => bill.amountTotal,
      (bill) => <InvoiceStatusPicker value={bill?.status} readOnly />,
    ];
    if (rights.includes(RIGHT_BILL_UPDATE)) {
      formatters.push((bill) => (
        <Tooltip title={formatMessage(intl, "invoice", "editButtonTooltip")}>
          <IconButton
            href={billUpdatePageUrl(bill)}
            onClick={(e) => e.stopPropagation() && onDoubleClick(bill)}
            disabled={deletedBillUuids.includes(bill.id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    if (rights.includes(RIGHT_BILL_DELETE)) {
      formatters.push((bill) => (
        <Tooltip title={formatMessage(intl, "invoice", "deleteButtonTooltip")}>
          <IconButton
            onClick={() => onDelete(bill)}
            disabled={bill?.status === STATUS.PAYED || deletedBillUuids.includes(bill.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

  const rowIdentifier = (bill) => bill.id;

  const sorts = () => [
    ["subjectType", true],
    ["thirdpartyType", true],
    ["code", true],
    ["dateBill", true],
    ["amountTotal", true],
    ["status", true],
  ];

  const billUpdatePageUrl = (bill) => modulesManager.getRef("bill.route.bill") + "/" + bill?.id;

  const onDoubleClick = (bill, newTab = false) =>
    rights.includes(RIGHT_BILL_UPDATE) &&
    !deletedBillUuids.includes(bill.id) &&
    historyPush(modulesManager, history, "bill.route.bill", [bill?.id], newTab);

  const onDelete = (bill) => setBillToDelete(bill);

  const isRowDisabled = (_, bill) => deletedBillUuids.includes(bill.id);

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: "isDeleted: false",
    },
  });

  return (
    <Searcher
      module="bill"
      FilterPane={BillFilter}
      fetch={fetch}
      items={bills}
      itemsPageInfo={billsPageInfo}
      fetchingItems={fetchingBills}
      fetchedItems={fetchedBills}
      errorItems={errorBills}
      tableTitle={formatMessageWithValues(intl, "bill", "bills.searcherResultsTitle", {
        billsTotalCount,
      })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      defaultOrderBy="code"
      rowIdentifier={rowIdentifier}
      onDoubleClick={onDoubleClick}
      defaultFilters={defaultFilters()}
      rowDisabled={isRowDisabled}
      rowLocked={isRowDisabled}
      actions={actions}
      actionsContributionKey={actionsContributionKey}
      withSelection="multiple"
      selectionMessage={"bill.selection.count"}
    />
  );
};

const mapStateToProps = (state) => ({
  fetchingBills: state.invoice.fetchingBills,
  fetchedBills: state.invoice.fetchedBills,
  errorBills: state.invoice.errorBills,
  bills: state.invoice.bills,
  billsPageInfo: state.invoice.billsPageInfo,
  billsTotalCount: state.invoice.billsTotalCount,
  confirmed: state.core.confirmed,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchBills,
      deleteBill,
      coreConfirm,
      journalize,
    },
    dispatch,
  );
};

export default withHistory(
  withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BillSearcher))),
);

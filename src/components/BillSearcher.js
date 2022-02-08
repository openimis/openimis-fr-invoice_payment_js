import React from "react";
import { injectIntl } from "react-intl";
import {
  withModulesManager,
  formatMessageWithValues,
  Searcher,
  formatDateFromISO,
  coreConfirm,
  journalize,
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchBills } from "../actions";
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
  EMPTY_STRING,
  INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_CONTRIBUTION_KEY,
  INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_PROPS,
  PICKER_NESTED_PROPERTY_REGEX,
  PICKER_NESTED_PROPERTY_NAME_REGEX,
  PICKER_NESTED_PROPERTY_PROJECTION_REGEX,
} from "../constants";
import BillFilter from "./BillFilter";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import _pick from "lodash/pick";

const BillSearcher = ({
  intl,
  modulesManager,
  fetchBills,
  fetchingBills,
  fetchedBills,
  errorBills,
  bills,
  billsPageInfo,
  billsTotalCount,
}) => {
  const fetch = (params) => fetchBills(params);

  const headers = () => [
    "bill.subject",
    "bill.thirdparty",
    "bill.code",
    "bill.dateBill",
    "bill.amountTotal",
    "bill.status.label",
  ];

  const itemFormatters = () => [
    (bill) => getSubjectAndThirdpartyTypePicker(bill.subjectTypeName, bill.subject),
    (bill) => getSubjectAndThirdpartyTypePicker(bill.thirdpartyTypeName, bill.thirdparty),
    (bill) => bill.code,
    (bill) => (!!bill.dateBill ? formatDateFromISO(modulesManager, intl, bill.dateBill) : EMPTY_STRING),
    (bill) => bill.amountTotal,
    (bill) => <InvoiceStatusPicker value={bill?.status} readOnly />,
  ];

  const rowIdentifier = (bill) => bill.id;

  const sorts = () => [
    ["subjectTypeName", true],
    ["thirdpartyId", true],
    ["code", true],
    ["dateBill", true],
    ["amountTotal", true],
    ["status", true],
  ];

  const getSubjectAndThirdpartyTypePickerContribution = (type) =>
    modulesManager
      .getContribs(INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_CONTRIBUTION_KEY)
      .find((pickerComponent) => pickerComponent?.[INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_PROPS.TYPE] === type);

  const getSubjectAndThirdpartyTypePicker = (objectTypeName, objectJson) => {
    const Picker =
      getSubjectAndThirdpartyTypePickerContribution(objectTypeName)?.[
        INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_PROPS.PICKER
      ];
    const object = JSON.parse(JSON.parse(objectJson));
    const projection = getSubjectAndThirdpartyTypePickerProjection(objectTypeName);
    const value = {};
    projection.forEach((property) => {
      if (!!property.match(PICKER_NESTED_PROPERTY_REGEX)) {
        const propertyName = property.match(PICKER_NESTED_PROPERTY_NAME_REGEX)?.[0];
        
        const propertyProjection = property.match(PICKER_NESTED_PROPERTY_PROJECTION_REGEX)?.[0].slice(1, -1).split(" ");
        value[propertyName] = _pick(object[propertyName], propertyProjection);
      } else {
        value[property] = object[property];
      }
    });
    return !!Picker ? <Picker value={value} readOnly /> : objectTypeName;
  };

  const getSubjectAndThirdpartyTypePickerProjection = (type) =>
    getSubjectAndThirdpartyTypePickerContribution(type)?.[
      INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_PROPS.PICKER_PROJECTION
    ];

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
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchBills,
      coreConfirm,
      journalize,
    },
    dispatch,
  );
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(BillSearcher)));

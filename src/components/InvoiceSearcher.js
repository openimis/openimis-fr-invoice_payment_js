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
import { fetchInvoices } from "../actions";
import {
  DEFAULT_PAGE_SIZE,
  ROWS_PER_PAGE_OPTIONS,
  EMPTY_STRING,
  STATUS_PREFIX_LENGTH,
  INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_CONTRIBUTION_KEY,
  INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_PROPS,
  PICKER_NESTED_PROPERTY_REGEX,
  PICKER_NESTED_PROPERTY_NAME_REGEX,
  PICKER_NESTED_PROPERTY_PROJECTION_REGEX,
} from "../constants";
import InvoiceFilter from "./InvoiceFilter";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import _pick from "lodash/pick";

const InvoiceSearcher = ({
  intl,
  modulesManager,
  fetchInvoices,
  fetchingInvoices,
  fetchedInvoices,
  errorInvoices,
  invoices,
  invoicesPageInfo,
  invoicesTotalCount,
}) => {
  const fetch = (params) => fetchInvoices(params);

  const headers = () => [
    "invoice.type",
    "invoice.recipients",
    "invoice.code",
    "invoice.dateInvoice",
    "invoice.amountTotal",
    "invoice.status.label",
  ];

  const itemFormatters = () => [
    (invoice) => getSubjectAndThirdpartyTypePicker(invoice.subjectTypeName, invoice.subject),
    (invoice) => getSubjectAndThirdpartyTypePicker(invoice.thirdpartyTypeName, invoice.thirdparty),
    (invoice) => invoice.code,
    (invoice) => (!!invoice.dateInvoice ? formatDateFromISO(modulesManager, intl, invoice.dateInvoice) : EMPTY_STRING),
    (invoice) => invoice.amountTotal,
    (invoice) => <InvoiceStatusPicker value={invoice.status.substring(STATUS_PREFIX_LENGTH)} readOnly />,
  ];

  const rowIdentifier = (invoice) => invoice.id;

  const sorts = () => [
    ["subjectTypeName", true],
    ["thirdpartyId", true],
    ["code", true],
    ["dateInvoice", true],
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
        /**
         * separate a projection from a property name, then remove curly brackets around the string
         * and split the string using whitespace separator to get an array of projection property names
         */
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
      module="contact"
      FilterPane={InvoiceFilter}
      fetch={fetch}
      items={invoices}
      itemsPageInfo={invoicesPageInfo}
      fetchingItems={fetchingInvoices}
      fetchedItems={fetchedInvoices}
      errorItems={errorInvoices}
      tableTitle={formatMessageWithValues(intl, "invoice", "invoices.searcher.resultsTitle", {
        invoicesTotalCount,
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
  fetchingInvoices: state.invoice.fetchingInvoices,
  fetchedInvoices: state.invoice.fetchedInvoices,
  errorInvoices: state.invoice.errorInvoices,
  invoices: state.invoice.invoices,
  invoicesPageInfo: state.invoice.invoicesPageInfo,
  invoicesTotalCount: state.invoice.invoicesTotalCount,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchInvoices,
      coreConfirm,
      journalize,
    },
    dispatch,
  );
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(InvoiceSearcher)));

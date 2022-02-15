import React from "react";
import { Tab } from "@material-ui/core";
import { formatMessage, PublishedComponent } from "@openimis/fe-core";
import { BILL_PAYMENTS_TAB_VALUE, RIGHT_BILL_PAYMENT_SEARCH } from "../constants";
import BillPaymentsSearcher from "./BillPaymentsSearcher";


const BillPaymentsTabLabel = ({ intl, rights, onChange, tabStyle, isSelected }) =>
  rights?.includes(RIGHT_BILL_PAYMENT_SEARCH) && (
    <Tab
      onChange={onChange}
      className={tabStyle(BILL_PAYMENTS_TAB_VALUE)}
      selected={isSelected(BILL_PAYMENTS_TAB_VALUE)}
      value={BILL_PAYMENTS_TAB_VALUE}
      label={formatMessage(intl, "invoice", "billPayments.label")}
    />
  );


const BillPaymentsTabPanel = ({ value, bill }) => (
  <PublishedComponent
    pubRef="policyHolder.TabPanel"
    module="bill"
    index={BILL_PAYMENTS_TAB_VALUE}
    value={value}
  >
    <BillPaymentsSearcher bill={bill} />
  </PublishedComponent>
);


export { BillPaymentsTabLabel, BillPaymentsTabPanel };

import React from "react";
import { injectIntl } from "react-intl";
import { withModulesManager, formatMessage, TextInput, NumberInput, PublishedComponent } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME, STARTS_WITH_LOOKUP } from "../constants";
import _debounce from "lodash/debounce";
import PaymentInvoiceStatusPicker from "../pickers/PaymentInvoiceStatusPicker";

const styles = (theme) => ({
    form: {
      padding: 0,
    },
    item: {
      padding: theme.spacing(1),
    },
  });

  const BillPaymentsFilter = ({intl, classes, filters, onChangeFilters }) => {
    const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFUALT_DEBOUNCE_TIME);
  
    const filterValue = (filterName) => filters?.[filterName]?.value;
  
    const onChangeFilter = (filterName) => (value) => {
      debouncedOnChangeFilters([
        {
          id: filterName,
          value: !!value ? value : null,
          filter: `${filterName}: ${value}`,
        },
      ]);
    };
  
    const onChangeStringFilter =
      (filterName, lookup = null) =>
      (value) => {
        lookup
          ? debouncedOnChangeFilters([
              {
                id: filterName,
                value,
                filter: `${filterName}_${lookup}: "${value}"`,
              },
            ])
          : onChangeFilters([
              {
                id: filterName,
                value,
                filter: `${filterName}: "${value}"`,
              },
            ]);
      };
  
    return (
      <Grid container className={classes.form}>
        <Grid item xs={2} className={classes.item}>
          <PaymentInvoiceStatusPicker
            label="paymentInvoice.reconciliationStatus.label"
            withNull
            nullLabel={formatMessage(intl, "invoice", "any")}
            value={filterValue("reconciliationStatus")}
            onChange={(value) =>
              onChangeFilters([
                {
                  id: "reconciliationStatus",
                  value: value,
                  filter: `reconciliationStatus: "${value}"`,
                },
              ])
            }
          />
        </Grid> 
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="paymentInvoice.codeExt"
            value={filterValue("codeExt")}
            onChange={onChangeStringFilter("codeExt", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="paymentInvoice.label"
            value={filterValue("label")}
            onChange={onChangeStringFilter("label", STARTS_WITH_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="paymentInvoice.codeTp"
            value={filterValue("codeTp")}
            onChange={onChangeStringFilter("codeTp", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="paymentInvoice.codeReceipt"
            value={filterValue("codeReceipt")}
            onChange={onChangeStringFilter("codeReceipt", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="paymentInvoice.fees"
            min={0}
            value={filterValue("fees")}
            onChange={onChangeFilter("fees")}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="invoice"
            label="paymentInvoice.amountReceived"
            min={0}
            value={filterValue("amountReceived")}
            onChange={onChangeFilter("amountReceived")}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="paymentInvoice.datePayment"
            value={filterValue("datePayment")}
            onChange={onChangeStringFilter("datePayment")}
          />
      </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="paymentInvoice.paymentOrigin"
            value={filterValue("paymentOrigin")}
            onChange={onChangeStringFilter("paymentOrigin", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="invoice"
            label="paymentInvoice.payerRef"
            value={filterValue("payerRef")}
            onChange={onChangeStringFilter("payerRef", CONTAINS_LOOKUP)}
          />
        </Grid>
      </Grid>
    );
  };
  
  export default withModulesManager(injectIntl(withTheme(withStyles(styles)(BillPaymentsFilter))));

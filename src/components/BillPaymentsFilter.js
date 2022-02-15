import React from "react";
import { injectIntl } from "react-intl";
import { withModulesManager, formatMessage, TextInput, NumberInput, PublishedComponent } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME, STARTS_WITH_LOOKUP } from "../constants";
import _debounce from "lodash/debounce";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker";

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
          <InvoicePaymentStatusPicker
            label="invoicePayment.status.label"
            withNull
            nullLabel={formatMessage(intl, "bill", "any")}
            value={filterValue("status")}
            onChange={(value) =>
              onChangeFilters([
                {
                  id: "status",
                  value: value,
                  filter: `status: "${value}"`,
                },
              ])
            }
          />
        </Grid>  
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="bill"
            label="billPayment.codeExt"
            value={filterValue("codeExt")}
            onChange={onChangeStringFilter("codeExt", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="bill"
            label="billPayment.label"
            value={filterValue("label")}
            onChange={onChangeStringFilter("label", STARTS_WITH_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="bill"
            label="billPayment.codeTp"
            value={filterValue("codeTp")}
            onChange={onChangeStringFilter("codeTp", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="bill"
            label="billPayment.codeReceipt"
            value={filterValue("codeReceipt")}
            onChange={onChangeStringFilter("codeReceipt", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="bill"
            label="billPayment.amountPayed"
            min={0}
            value={filterValue("amountPayed")}
            onChange={onChangeFilter("amountPayed")}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="bill"
            label="billPayment.fees"
            min={0}
            value={filterValue("fees")}
            onChange={onChangeFilter("fees")}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <NumberInput
            module="bill"
            label="billPayment.amountReceived"
            min={0}
            value={filterValue("amountReceived")}
            onChange={onChangeFilter("amountReceived")}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="bill"
            label="billPayment.datePayment"
            value={filterValue("datePayment")}
            onChange={onChangeStringFilter("datePayment")}
          />
      </Grid>
        <Grid item xs={2} className={classes.item}>
          <TextInput
            module="bill"
            label="billPayment.paymentOrigin"
            value={filterValue("paymentOrigin")}
            onChange={onChangeFilter("paymentOrigin")}
          />
        </Grid>
      </Grid>
    );
  };
  
  export default withModulesManager(injectIntl(withTheme(withStyles(styles)(BillPaymentsFilter))));

import React from "react";
import { TextInput, NumberInput } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import _debounce from "lodash/debounce";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

const InvoiceLineItemsFilter = ({ classes, filters, onChangeFilters }) => {
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
        <TextInput
          module="invoice"
          label="invoiceLineItem.code"
          value={filterValue("code")}
          onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="invoiceLineItem.description"
          value={filterValue("description")}
          onChange={onChangeStringFilter("description", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="invoiceLineItem.ledgerAccount"
          value={filterValue("ledgerAccount")}
          onChange={onChangeStringFilter("ledgerAccount", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoiceLineItem.quantity"
          min={0}
          value={filterValue("quantity")}
          onChange={onChangeFilter("quantity")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoiceLineItem.unitPrice"
          min={0}
          value={filterValue("unitPrice")}
          onChange={onChangeFilter("unitPrice")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoiceLineItem.discount"
          min={0}
          value={filterValue("discount")}
          onChange={onChangeFilter("discount")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoiceLineItem.deduction"
          min={0}
          value={filterValue("deduction")}
          onChange={onChangeFilter("deduction")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoiceLineItem.amountTotal"
          min={0}
          value={filterValue("amountTotal")}
          onChange={onChangeFilter("amountTotal")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <NumberInput
          module="invoice"
          label="invoiceLineItem.amountNet"
          min={0}
          value={filterValue("amountNet")}
          onChange={onChangeFilter("amountNet")}
        />
      </Grid>
    </Grid>
  );
};

export default withTheme(withStyles(styles)(InvoiceLineItemsFilter));

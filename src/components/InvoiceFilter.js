import React from "react";
import { injectIntl } from "react-intl";
import { withModulesManager, formatMessage, TextInput, NumberInput, PublishedComponent } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import SubjectTypePicker from "../pickers/SubjectTypePicker";
import ThirpartyTypePicker from "../pickers/ThirpartyTypePicker";
import _debounce from "lodash/debounce";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

const InvoiceFilter = ({ intl, classes, filters, onChangeFilters }) => {
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
        <SubjectTypePicker
          label="type"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("subjectType")}
          onChange={onChangeStringFilter("subjectType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <ThirpartyTypePicker
          label="recipients"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("thirdpartyType")}
          onChange={onChangeStringFilter("thirdpartyType")}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <TextInput
          module="invoice"
          label="code"
          value={filterValue("code")}
          onChange={onChangeStringFilter("code", CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="invoice"
          label="dateInvoice"
          value={filterValue("dateInvoice")}
          onChange={(v) =>
            onChangeFilters([
              {
                id: "dateInvoice",
                value: v,
                filter: `dateInvoice: "${v}"`,
              },
            ])
          }
        />
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <InvoiceStatusPicker
          label="status.label"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
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
        <NumberInput
          module="invoice"
          label="amountTotal"
          min={0}
          value={filterValue("amountTotal")}
          onChange={onChangeFilter("amountTotal")}
        />
      </Grid>
    </Grid>
  );
};

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(InvoiceFilter))));

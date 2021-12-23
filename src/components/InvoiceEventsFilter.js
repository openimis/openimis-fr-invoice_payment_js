import React from "react";
import { injectIntl } from "react-intl";
import { TextInput, formatMessage } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME } from "../constants";
import _debounce from "lodash/debounce";
import { defaultFilterStyles } from "../util/styles";
import InvoiceEventTypePicker from "../pickers/InvoiceEventTypePicker";

const InvoiceEventsFilter = ({ intl, classes, filters, onChangeFilters }) => {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFUALT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

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
        <InvoiceEventTypePicker
          label="invoiceEvent.eventType.label"
          withNull
          nullLabel={formatMessage(intl, "invoice", "any")}
          value={filterValue("eventType")}
          onChange={onChangeStringFilter("eventType")}
        />
      </Grid>
      <Grid item xs={10} className={classes.item}>
        <TextInput
          module="invoice"
          label="invoiceEvent.message"
          value={filterValue("message")}
          onChange={onChangeStringFilter("message", CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
};

export default injectIntl(withTheme(withStyles(defaultFilterStyles)(InvoiceEventsFilter)));

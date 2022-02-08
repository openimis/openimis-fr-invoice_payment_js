import React from "react";
import { Helmet, withModulesManager, formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { RIGHT_BILL_SEARCH } from "../constants";
import BillSearcher from "../components/BillSearcher";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

const BillsPage = (props) => {
  const { intl, classes, rights } = props;

  return (
    rights.includes(RIGHT_BILL_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessage(props.intl, "bill", "bills.pageTitle")} />
        <BillSearcher rights={rights} />
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps)(BillsPage)))));

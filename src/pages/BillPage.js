import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Helmet,
  withHistory,
  formatMessage,
  formatMessageWithValues,
  coreConfirm,
  journalize,
  decodeId,
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { RIGHT_BILL_UPDATE, STATUS } from "../constants";
import { fetchBill, deleteBill } from "../actions";
import BillHeadPanel from "../components/BillHeadPanel";
import DeleteIcon from "@material-ui/icons/Delete";
import { getEnumValue } from "../util/enum";
import BillTabPanel from "../components/BillTabPanel";
import { ACTION_TYPE } from "../reducer";

const styles = (theme) => ({
  page: theme.page,
});

const BillPage = ({
  intl,
  classes,
  rights,
  history,
  billUuid,
  bill,
  fetchBill,
  deleteBill,
  coreConfirm,
  confirmed,
  submittingMutation,
  mutation,
  journalize,
}) => {
  const [editedBill, setEditedBill] = useState({});
  const [confirmedAction, setConfirmedAction] = useState(() => null);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    if (!!billUuid) {
      fetchBill([`id: "${billUuid}"`]);
    }
  }, [billUuid]);

  useEffect(() => confirmed && confirmedAction(), [confirmed]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      mutation?.actionType === ACTION_TYPE.DELETE_BILL && back();
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  useEffect(() => setEditedBill(bill), [bill]);

  const back = () => history.goBack();

  const onChange = (bill) => setEditedBill(bill);

  const titleParams = (bill) => ({ label: bill?.code });

  const deleteBillCallback = () => deleteBill(
    bill,
    formatMessageWithValues(intl, "invoice", "bill.delete.mutationLabel", {
      code: bill?.code,
    }),
  );

  const openDeleteBillConfirmDialog = () => {
    setConfirmedAction(() => deleteBillCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "bill.delete.confirm.title", {
        code: bill?.code,
      }),
      formatMessage(intl, "invoice", "bill.delete.confirm.message"),
    );
  };

  const actions = [
    !!bill && 
      getEnumValue(bill?.status) !== STATUS.PAYED && {
        doIt: openDeleteBillConfirmDialog,
        icon: <DeleteIcon />,
        tooltip: formatMessage(intl, "invoice", "deleteButtonTooltip"),
      },
  ];

  return (
    rights.includes(RIGHT_BILL_UPDATE) && (
      <div className={classes.page}>
        <Helmet title={formatMessageWithValues(intl, "bill", "pageTitle", titleParams(bill))} />
        <Form
          module="bill"
          title="pageTitle"
          titleParams={titleParams(bill)}
          bill={editedBill}
          back={back}
          onChange={onChange}
          HeadPanel={BillHeadPanel}
          Panels={[BillTabPanel]}
          rights={rights}
          actions={actions}
          setConfirmedAction={setConfirmedAction}
        />
      </div>
    )
  );
};

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  billUuid: props.match.params.bill_uuid,
  confirmed: state.core.confirmed,
  fetchingBill: state.invoice.fetchingBill,
  fetchedBill: state.invoice.fetchedBill,
  bill: state.invoice.bill,
  errorBill: state.invoice.errorBill,
  confirmed: state.core.confirmed,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchBill, deleteBill, coreConfirm, journalize }, dispatch);
};

export default withHistory(
  injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BillPage)))),
);

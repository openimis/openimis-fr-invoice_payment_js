import React, { useState } from "react";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  NumberInput,
  formatMessageWithValues,
  formatMessage,
} from "@openimis/fe-core";
import { Fab, Grid, IconButton, Tooltip } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { createInvoicePayment, updateInvoicePayment } from "../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EMPTY_PAYMENT } from "../constants";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker";

const styles = (theme) => ({
  item: theme.paper.item,
});

const InvoicePaymentDialog = ({
  intl,
  classes,
  invoice,
  invoicePayment = null,
  disabled,
  createInvoicePayment,
  updateInvoicePayment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] = useState({ invoiceId: invoice.id, ...(invoicePayment ?? EMPTY_PAYMENT) });
  const isNew = !invoicePayment;

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setPayment({ invoiceId: payment.invoiceId, ...(isNew ? EMPTY_PAYMENT : invoicePayment) });
  };

  const handleSave = () => {
    isNew
      ? createInvoicePayment(
          payment,
          formatMessageWithValues(intl, "invoice", "invoicePayment.create.mutationLabel", {
            invoicePaymentLabel: payment.label,
            invoiceCode: invoice?.code,
          }),
        )
      : updateInvoicePayment(
          payment,
          formatMessageWithValues(intl, "invoice", "invoicePayment.update.mutationLabel", {
            invoicePaymentLabel: payment.label,
            invoiceCode: invoice?.code,
          }),
        );
    handleClose();
  };

  const onAttributeChange = (attribute) => (value) =>
    setPayment({
      ...payment,
      [attribute]: value,
    });

  const canSave = Object.keys(payment)?.every((key) => !!payment[key]);

  return (
    <>
      {isNew ? (
        <Fab size="small" color="primary" onClick={handleOpen}>
          <AddIcon />
        </Fab>
      ) : (
        <Tooltip title={formatMessage(intl, "invoice", "editButtonTooltip")}>
          <IconButton onClick={handleOpen} disabled={disabled}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>
          <FormattedMessage module="invoice" id={`invoicePayment.${isNew ? "create" : "update"}.label`} />
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" className={classes.item}>
            <Grid item className={classes.item}>
              <InvoicePaymentStatusPicker
                label="invoicePayment.status.label"
                withNull
                value={payment?.status}
                onChange={onAttributeChange("status")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextInput
                module="invoice"
                label="invoicePayment.codeExt"
                value={payment?.codeExt}
                onChange={onAttributeChange("codeExt")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextInput
                module="invoice"
                label="invoicePayment.label"
                value={payment?.label}
                onChange={onAttributeChange("label")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextInput
                module="invoice"
                label="invoicePayment.codeTp"
                value={payment?.codeTp}
                onChange={onAttributeChange("codeTp")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextInput
                module="invoice"
                label="invoicePayment.codeReceipt"
                value={payment?.codeReceipt}
                onChange={onAttributeChange("codeReceipt")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <NumberInput
                module="invoice"
                label="invoicePayment.amountPayed"
                min={0}
                value={payment?.amountPayed}
                onChange={onAttributeChange("amountPayed")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <NumberInput
                module="invoice"
                label="invoicePayment.fees"
                min={0}
                value={payment?.fees}
                onChange={onAttributeChange("fees")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <NumberInput
                module="invoice"
                label="invoicePayment.amountReceived"
                min={0}
                value={payment?.amountReceived}
                onChange={onAttributeChange("amountReceived")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="invoice"
                label="invoicePayment.datePayment"
                value={payment?.datePayment}
                onChange={onAttributeChange("datePayment")}
                required
              />
            </Grid>
            <Grid item className={classes.item}>
              <TextInput
                module="invoice"
                label="invoicePayment.paymentOrigin"
                value={payment?.paymentOrigin}
                onChange={onAttributeChange("paymentOrigin")}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            <FormattedMessage module="invoice" id="dialog.cancel" />
          </Button>
          <Button onClick={handleSave} disabled={!canSave} variant="contained" color="primary" autoFocus>
            <FormattedMessage module="invoice" id={`dialog.${isNew ? "create" : "update"}`} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ createInvoicePayment, updateInvoicePayment }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(InvoicePaymentDialog))));

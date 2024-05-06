import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Grid, Divider, Typography, Button } from "@material-ui/core";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import TableChartIcon from '@material-ui/icons/TableChart';
import { withModulesManager, TextInput, FormattedMessage, PublishedComponent, NumberInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import SubjectTypePickerBill from "../pickers/SubjectTypePickerBill";
import ThirdPartyTypePickerBill from "../pickers/ThirdPartyTypePickerBill";
import { getSubjectAndThirdpartyTypePicker } from "../util/subject-and-thirdparty-picker";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import { generateReport } from "../actions"

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});


const BillHeadPanel = ({ modulesManager, classes, bill, mandatoryFieldsEmpty, generateReport, intl }) => {
  const handleGenerateReport = (fileFormat) => {
    const params = {
      fileFormat: fileFormat,
      billId: bill.id,
    }
    generateReport(params, intl);
  }

  const taxAnalysisTotal = !!bill?.taxAnalysis ? JSON.parse(bill.taxAnalysis)?.["total"] : null;
  return (
    <>
      <Grid container className={classes.tableTitle}>
        <Grid item xs={10}>
          <Grid container direction="column" className={classes.fullHeight}>
            <Grid item>
              <Typography>
                <FormattedMessage module="invoice" id="bill.headPanelTitle" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={1} className={classes.item}>
          <Button startIcon={<PictureAsPdfIcon />} variant="contained" onClick={() => handleGenerateReport("pdf")}>
            <FormattedMessage module="invoice" id="bill.downloadPDF" />
          </Button>
        </Grid>
        <Grid item container xs={1} className={classes.item}>
          <Button startIcon={<TableChartIcon />} variant="contained" onClick={() => handleGenerateReport("xlsx")}>
            <FormattedMessage module="invoice" id="bill.downloadXLSX" />
          </Button>
        </Grid>
      </Grid>
      <Divider />
      {mandatoryFieldsEmpty && (
        <>
          <div className={classes.item}>
            <FormattedMessage module="invoice" id="mandatoryFieldsEmptyError" />
          </div>
          <Divider />
        </>
      )}
      <Grid container className={classes.item}>
        <Grid item xs={3} className={classes.item}>
          <SubjectTypePickerBill label="bill.subject" withNull value={bill?.subjectTypeNameLabel} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, bill?.subjectTypeName, bill?.subject)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <ThirdPartyTypePickerBill label="bill.thirdparty" withNull value={bill?.thirdpartyTypeNameLabel} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, bill?.thirdpartyTypeName, bill?.thirdparty)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.code" value={bill?.code} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.codeTp" value={bill?.codeTp} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.codeExt" value={bill?.codeExt} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.dateDue"
            value={bill?.dateDue}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.dateBill"
            value={bill?.dateBill}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.dateValidFrom"
            value={bill?.dateValidFrom}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.dateValidTo"
            value={bill?.dateValidTo}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.datePayed"
            value={bill?.datePayed}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput
            module="invoice"
            label="bill.amountDiscount"
            displayZero
            value={bill?.amountDiscount}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="bill.amountNet" displayZero value={bill?.amountNet} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.taxAnalysis" value={taxAnalysisTotal} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="bill.amountTotal" displayZero value={bill?.amountTotal} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <InvoiceStatusPicker label="invoice.status.label" withNull value={bill?.status} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.currencyTpCode" value={bill?.currencyTpCode} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.currencyCode" value={bill?.currencyCode} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.note" value={bill?.note} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.terms" value={bill?.terms} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.paymentReference" value={bill?.paymentReference} readOnly />
        </Grid>
      </Grid>
    </>
  );
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { generateReport },
        dispatch);
};

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(BillHeadPanel)))));

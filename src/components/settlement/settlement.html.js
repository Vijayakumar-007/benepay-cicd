import React from "react";
import {
  Grid, CardContent, Card,
  Box,
} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../$widgets/buttons/form-button";
import TitleBar from "../title-bar/title-bar";
import DatePicker from "react-datepicker";

export function html() {
  const { loading, settlementDate } = this.state;
  return (
    <div className="settlement-main">
      {loading && (
        <div id="semiTransparenDiv"></div>)}
      <Box mt={4}>
        <TitleBar
          className={"mt-3"}
          color="blue"
          ruleColor="blue"
          title={"Settlement Reports"}
        />
        <div>
          <Box mt={1}>
            <Card className="pb-5 pt-2 px-3">
              <CardContent className="p-2">
                <div style={{ width: '25%' }}>
                  <p className="mb-2 h-100 d-flex align-items-center">
                    Settlement Date
                  </p>
                  <DatePicker style={{ width: '100%' }} selected={this.state.settlementDate} placeholderText="dd/mon/yyyy" dateFormat="dd/MMM/yyyy" onChange={(date) =>
                    this.setState({ settlementDate: date })
                  } />
                </div>

                <div style={{ float: "left" }}>
                  {this.state.noSettlementReportFound && (
                    <span
                      style={{
                        float: "left",
                        fontSize: "15px",
                        marginRight: "150px",
                        color: "red",
                        marginTop: '20px',
                        marginBottom: '-28px'
                      }}
                    >
                      {"There are no settlement records for chosen date"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Box>
        </div>

      </Box>

      <div className="mt-4">
        <ButtonPrimary
          onClick={this.downloadSettlementFile}
          disabled={loading || !settlementDate}
        >
          Apply
        </ButtonPrimary>
        <ButtonSecondary
          onClick={this.clearSettlement}
          style={{ marginLeft: "5px" }}
          disabled={loading}
        >
          Clear
        </ButtonSecondary>
      </div>
    </div>
  );
}

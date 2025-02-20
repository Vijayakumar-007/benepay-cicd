import React from "react";
import './reports.scss'
import {
  Grid, CardContent, Card,
  Box,
} from "@mui/material";
import { ButtonPrimary, ButtonSecondary } from "../$widgets/buttons/form-button";
import TitleBar from "../title-bar/title-bar";
import DatePicker from "react-datepicker";
import GetAppIcon from "@material-ui/icons/GetApp";
import Paper from "@material-ui/core/Paper";
import TableScrollbar from 'react-table-scrollbar';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ReactPaginate from 'react-paginate';
import Add from '@material-ui/icons/Add'
import WarningIcon from '@material-ui/icons/Warning';;
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { DateFormat } from "../../enum/common.enum";

export function html() {
  const { loading,
    titleName,
    settlementReportsStartDate,
    settlementReportsEndDate,
    settlementReportsSettlemntProvider,
    settlementReportsMerchantName,
    settlementReportsMerchantId,
    allProviders,
    allMerchants,
    searchedSettlementReportsResult,
    pageNo,
    pageSize,
    initalPage,
    totalPages,
    numPageShow,
    toastTitle,
    toastBody,
    toastShow,
    reportsMenu,
    setttlementReports
  } = this.state;

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#f9f9f9",
      color: "#000",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);


  return (

    <div className="settlement-main">
      {loading && (
        <div id="semiTransparenDiv"></div>)}
      <Box mt={4}>
        <TitleBar
          className={"mt-1"}
          color="blue"
          ruleColor="blue"
          title={titleName}
        />
      </Box>

      {reportsMenu && (
        <div className="py-4 d-flex">
          <button style={{backgroundColor: 'var(--secondary-color)', color: 'white'}} className="text-decoration-none p-5 w-25 mx-2 d-flex flex-column justify-content-start align-items-center settlementReportsBtn" onClick={() => { this.setState({ reportsMenu: false, setttlementReports: true, titleName: 'Reports > Settlement Reports' }); this.handleApplySettlementReports(1); }}>
            <h6 className="mb-4 font-xl text-white">Settlement Reports</h6>
            <h6 className="text-center text-white font-weight-normal">List <span className="text-white font-weight-bold">ALL SETTLED</span> transaction and refunds for a certain day</h6>
          </button>
          {/* <button href="#" className="text-decoration-none p-5 w-25 mx-2 d-flex flex-column justify-content-start align-items-center" style={{backgroundColor: '#EBECEF', border: 'none'}}>
            <h6 className="mb-4 font-xl" style={{color: "black"}}>MI Reports</h6>
            <h6 className="text-center text-info" style={{fontWeight: "light"}}>List <span className="text-primary" style={{fontWeight: "bold"}}>ALL</span> transaction and refunds for a certain day if there status have changed in that day</h6>
          </button> */}
        </div>
      )}

      {setttlementReports && (
        <Box mt={1}>
          <Card id="settlementReportCard" className="pb-5 pt-2 px-3">
            <CardContent>



              {/* Content */}
              <div className="tab-content" id="pills-tabContent">

                {/* From Provider */}
                <div className="tab-pane fade show active" id="pills-settlment-reports" role="tabpanel" aria-labelledby="pills-settlment-reports-tab">
                  {/* Inputs */}
                  <div className="row justify-content-start">
                    <div className="col-3">
                      <label htmlFor="settlementReportsSettlemntDate" className="h6 font-weight-normal mr-1">Settlement Date</label>
                      <div className="row justify-content-start mt-2">
                        <div className="col">
                          <DatePicker id="settlementReportsSettlemntDate" className="w-100" maxDate={new Date(Date.now())} selected={settlementReportsStartDate} placeholderText="From" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ settlementReportsStartDate: date })} />
                        </div>
                        <div className="col">
                          <DatePicker className="w-100" maxDate={new Date(Date.now())} selected={settlementReportsEndDate} placeholderText="To" dateFormat={DateFormat.datePickerDate} onChange={(date) => this.setState({ settlementReportsEndDate: date })} />
                          {/* dateFormat="yyyy-MM-dd"   */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="d-flex justify-content-start mt-5 mr-5">
                    <span className="mr-5">
                      <ButtonPrimary
                        onClick={() => {
                          this.setState({ initalPage: 0 });
                          this.handleApplySettlementReports(1);
                        }}
                        style={{background: "var(--accent-color)", color: "var(--light-color)",}}
                      >
                        Search
                      </ButtonPrimary>
                      <ButtonSecondary
                        onClick={this.clearSettlementReports}
                        className="ml-1"
                        style={{background: "var(--light-color)", color: "var(--primary-color)",}}
                      >
                        Clear
                      </ButtonSecondary>
                    </span>
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>
        </Box>
      )}

      {searchedSettlementReportsResult && (
        <Box mt={1}>
          {/* Result */}
          {searchedSettlementReportsResult && searchedSettlementReportsResult.length > 0 ? (
            <div className="transactions-list my-4 overflow-x-hidden w-100">
              <TableContainer
                component={Paper}
                className="mt-2"
              >
                <TableScrollbar className="scroll-bar">
                  <Table
                    className="resultTable"
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow style={{ top: "0" }}>
                        <StyledTableCell align="left">
                          Generated On
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          Settlement Date
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          File Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Total Records
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Download
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchedSettlementReportsResult &&
                        searchedSettlementReportsResult.map((e, i) => (
                          <StyledTableRow key={i} className="rowHeight">
                            <StyledTableCell align="left">
                              {e.generatedOn ?  (e.generatedOn) : '-'}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {e.settlementDate ? `${("0" + e.settlementDate.dayOfMonth).slice(-2)}/${("0" + e.settlementDate.monthValue).slice(-2)}/${e.settlementDate.year}` : '-'}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.fileName}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {e.totalRecords}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <span onClick={this.downloadFromSettlementFile} fileid={e.fileId} download="Sample Upload File" className="cursor-pointer"><GetAppIcon /></span>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableScrollbar>
              </TableContainer>

              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={''}
                pageCount={this.state.totalPages}
                marginPagesDisplayed={0}
                pageRangeDisplayed={this.state.numPageShow}
                onPageChange={this.handlePaginateSettlementReports}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item '}
                pageLinkClassName={'page-link rounded-circle mx-1 my-2'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link rounded-circle mx-1 my-2'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link rounded-circle mx-1 my-2'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
                forcePage={this.state.initalPage}
              />

            </div>
          ) : (
            <div>
              <Paper
                className="d-flex justify-content-center align-items-center noFilesTextHeight"
                elevation={2}
              >
                {" "}
                No Files Uploaded Yet
              </Paper>
            </div>
          )}
        </Box>
      )}



    </div>
  );
}

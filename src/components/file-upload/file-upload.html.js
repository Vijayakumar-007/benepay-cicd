import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GetAppIcon from "@material-ui/icons/GetApp";
import TitleBar from "../title-bar/title-bar";
import TableScrollbar from "react-table-scrollbar";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "../$widgets/dialog";
import CloseIcon from "@material-ui/icons/Close";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import ReactPaginate from 'react-paginate';
import { DateFormat } from "../../enum/common.enum";

export function html() {
  const {
    uploadType,
    isLoading,
    uploadedFiles,
    isApiCalled,
    validationError,
    refundErrors,
    csvData,
    totalPages,
    initalPage,
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
    <div className="file-upload-main">
      <div className="card mt-2">
        <div className="card-body">
          <div className="upload-file-main">
            {/* <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isApiCalled}
              onClick={this.handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop> */}
            {isApiCalled && <div id="semiTransparenDiv"></div>}
            <TitleBar title={"Upload"} color={"green"} />
            <div className="row file-type mb-2">
              <strong className={"my-3 ml-3"}>File Type {isLoading}</strong>
              <RadioGroup
                onChange={this.handleChange}
                value={uploadType}
                row
                className={"ml-3"}
              >
                <FormControlLabel
                  value="payment"
                  control={<Radio color="primary" />}
                  label="Payment"
                />
                <FormControlLabel
                  value="Refund"
                  control={<Radio color="primary" />}
                  label="Refund"
                />
              </RadioGroup>
            </div>
            <div>
              <div id="drop-area">
                <form className="my-form">
                  <label htmlFor="fileElem">
                    <i
                      className="fa fa-upload uploadIcon"
                      style={{ fontSize: "60px" }}
                    ></i>
                    <br />
                    <input
                      type="file"
                      id="fileElem"
                      onChange={(e) => {
                        this.handleFileChange(e);
                        e.target.value = "";
                      }}
                      // accept=".csv/*"
                    />
                    <b>Choose a file to be uploaded</b>
                  </label>
                </form>
              </div>
              <div className="space-between">
                <p className={"my-3 ml-3"} style={{ fontSize: "14px" }}>
                  *File should be in CSV format and File size should be under
                  200KB.
                </p>
              </div>
              {validationError && validationError.length > 0 && (
                <div className="error-box mt-4">
                  <h5 className="text-danger mb-4">
                    File Upload Failed, please find the error details below -
                  </h5>
                  <table>
                    <thead>
                    {uploadType === "payment" && (
                      <tr>
                        <th style={{ width: "150px" }}>Attribute</th>
                        <th style={{ width: "150px" }}>Level</th>
                        <th>Error Message</th>
                      </tr>
                      )}
                      {uploadType === "Refund" && (
                        <tr>
                          <th style={{ width: "150px" }}> Attribute</th>
                          <th> Error Message</th>
                        </tr>
                        )}
                    </thead>
                    <tbody>
                      {validationError.map((ve, index) => (
                        <tr key={index}>
                          <td>{this.getFormattedAttribute(ve)}</td>
                          <td>{ve.level || "File Parsing"}</td>
                          <td>{ve.errorMsg || ve.errorDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="btn btn-primary my-4"
                    onClick={this.clearError}
                  >
                    Clear Error
                  </button>
                </div>
              )}
              {refundErrors && refundErrors.length > 0 && (
                <ConfirmDialog
                  title="Warning"
                  open={true}
                  maxWidth={"md"}
                  setOpen={true}
                >
                  <div
                    className="error-box"
                    style={{ position: "relative", bottom: "20px" }}
                  >
                    <div className="d-flex">
                      <div className="flex-item-1 d-flex" style={{ flex: "1" }}>
                        <h5 className="text-danger mb-4">
                          Refund File Upload Error Summary
                        </h5>
                      </div>
                      <div className="flex-item-2">
                        <CloseIcon
                          className="cursor-pointer"
                          onClick={() => this.setState({ refundErrors: [] })}
                        />
                      </div>
                    </div>
                    <table className="mt-4">
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid #f2f2f2",
                            height: "35px",
                          }}
                        >
                          <th style={{ width: "250px" }}> File Id</th>
                          <th style={{ width: "250px" }}> Input Request</th>
                          <th style={{ width: "250px" }}> Error Code</th>
                          <th style={{ width: "250px" }}>
                            {" "}
                            Received TimeStamp
                          </th>
                          <th style={{ width: "250px" }}> Error Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {refundErrors.map((ve, i) => (
                          <tr key={i} style={{ height: "80px" }}>
                            <td>{ve.refId}</td>
                            <td>{ve.inputRequest}</td>
                            <td>{ve.errorCode}</td>
                            <td>
                              {/* {ve.receivedDate.toString().split("T")[0]}{" "}
                              {
                                ve.receivedDate
                                  .toString()
                                  .split("T")[1]
                                  .toString()
                                  .split(".")[0]
                              } */}
                              {/* {moment(ve.creationDate).format('DD-MMM-YYYY')} <br /> {moment(ve.creationDate).format('HH:mm:ss')} */}
                              {(ve.receivedDate)}
                            </td>
                            <td>{ve.errorDesc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      className="download-btn d-flex justify-content-end"
                      style={{ height: "15px" }}
                    >
                      {csvData && csvData.data && (
                        <CSVLink {...csvData}>
                          <button className="btn btn-primary my-4">
                            Download Error File
                          </button>
                        </CSVLink>
                      )}
                    </div>
                  </div>
                </ConfirmDialog>
              )}
              {uploadedFiles && uploadedFiles.length > 0 ? (
                <div className="transactions-list my-4" width="100%">
                  <TableContainer
                    component={Paper}
                    style={{ marginTop: "3rem" }}
                  >
                    {/* ------------------------------------------------------------------------------------------------------------- */}
                    {/* I have changed this from 10 to 18 */}
                    <TableScrollbar rows={10} className="scroll-bar">
                      <Table
                        style={{ minWidth: 700 }}
                        aria-label="customized table"
                      >
                        <TableHead style={{ backgroundColor: "red" }}>
                          <TableRow style={{ top: "0" }}>
                            <StyledTableCell
                              align="left"
                              style={{ minWidth: "180px", width: "190px" }}
                            >
                              File Name
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Upload Timestamp
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Upload Status
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Total Transactions
                            </StyledTableCell>
                            {uploadType === "payment" && (
                              <StyledTableCell align="center">
                                Uploaded Transactions
                              </StyledTableCell>
                            )}
                            {uploadType === "Refund" && (
                              <StyledTableCell align="center">
                                Successful Refunds
                              </StyledTableCell>
                            )}
                            {uploadType === "Refund" && (
                              <StyledTableCell align="center">
                                Failed Refunds
                              </StyledTableCell>
                            )}
                            {uploadType === "Refund" && (
                              <StyledTableCell
                                align="center"
                                style={{ minwidth: "110px", width: "110px" }}
                              >
                                Error Details
                              </StyledTableCell>
                            )}
                            {uploadType === "Refund" && (
                              <StyledTableCell
                                align="center"
                                style={{ minwidth: "110px", width: "110px" }}
                              >
                                Download Refund File
                              </StyledTableCell>
                            )}
                            {uploadType === "payment" && (
                              <StyledTableCell
                                align="center"
                                style={{ minwidth: "110px", width: "110px" }}
                              >
                                Payment Link Report
                              </StyledTableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {uploadedFiles &&
                            uploadedFiles.map((uf, i) => (
                              <StyledTableRow
                                key={i}
                                style={{ height: "90px" }}
                              >
                                <StyledTableCell align="left">
                                  {uf.fileName}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {moment(uf.creationDate).format(DateFormat.date)} <br /> {moment(uf.creationDate).format(DateFormat.time)}
                                  {/* {uf.creationDate.split(" ")[0]} <br/>
                               {uf.creationDate.split(" ")[1]} */}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {uf.status}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {!uf.totalTransactions
                                    ? "0"
                                    : uf.totalTransactions}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {uf.validTransaction}
                                </StyledTableCell>
                                {uploadType === "Refund" && (
                                  <StyledTableCell align="center">
                                    {uf.invalidTransaction}
                                  </StyledTableCell>
                                )}

                                <StyledTableCell
                                  align="centter"
                                  className="text-center"
                                >
                                  <GetAppIcon
                                    className={"mx-2 cursor-pointer"}
                                    onClick={() =>
                                      // In case of Payment, we are allowing icon to be clickable if OutputFilePath is not null or empty , otherwise icon is  disabled
                                      //In case of Refund ,we are disabling the icon if the status of refund file is Completed , otherwise allow to be clickable

                                      (uploadType === "payment" && (uf.outputFilePath !== '' && uf.outputFilePath !== null)) && this.downloadPaymentFileResponse(uf.fileId) ||
                                      (uploadType === "Refund" && (uf.status !== "COMPLETED" || uf.status !== "UPLOADED") && this.getErrorList(uf.fileId))
                                    }
                                    //in case of payment icon is disabled ,if outputFilePath is null or empty  and  is case of refund icon is disabled if refund file status id completed 
                                    style={{ opacity: (uploadType === "payment" && (uf.outputFilePath === '' || uf.outputFilePath === null) || (uploadType === "Refund" && uf.status === "COMPLETED" || uf.status === "UPLOADED")) && 0.5 }}
                                  />
                                </StyledTableCell>

                                {uploadType === "Refund" && (
                                  <StyledTableCell
                                    align="centter"
                                    className="text-center"
                                  >
                                    <GetAppIcon
                                      className={"mx-2 , cursor-pointer"}
                                      onClick={() =>
                                        uf.status === "COMPLETED" &&
                                        this.downloadPaymentFileResponse(
                                          uf.fileId
                                        )
                                      }
                                      style={{
                                        opacity:
                                          uf.status !== "COMPLETED" && 0.5,
                                      }}
                                    />
                                  </StyledTableCell>
                                )}
                              </StyledTableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableScrollbar>
                  </TableContainer>
                </div>
              ) : (
                <div>
                  <Paper
                    className="d-flex justify-content-center align-items-center"
                    elevation={2}
                    style={{ height: "250px" }}
                  >
                    {" "}
                    No Data Available
                  </Paper>
                </div>
              )}
            </div>
            {(uploadedFiles && uploadedFiles.length > 0) && (
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={''}
                pageCount={this.state.totalPages}
                marginPagesDisplayed={0}
                pageRangeDisplayed={3}
                onPageChange={this.handlePageChangePayment}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item "}
                pageLinkClassName={"page-link rounded-circle mx-1 my-2"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link rounded-circle mx-1 my-2"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link rounded-circle mx-1 my-2"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
                forcePage={this.state.initalPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

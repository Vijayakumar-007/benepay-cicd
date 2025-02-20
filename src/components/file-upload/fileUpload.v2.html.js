import React from "react";
import {
  Container,
  Grid,
  Chip,
  Typography,
  Button,
  Modal,
  IconButton,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  TableCell,
  TableRow,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "../$widgets/dialog";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { DateFormat } from "../../enum/common.enum";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faArrowRotateRight,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import FileInput from "./support-components/fileInput";
import { Close, DownloadForOffline } from "@mui/icons-material";
import ErrorModel from "./support-components/errorModel";
import RefreshIcon from '@mui/icons-material/Refresh';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import PermissionGuard from "components/$widgets/permission/permissionGuard";
import { PrivilegeConstants } from "config/constants";

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
    pageNoForRedirect,
    errorDetailsModel,
    selectedStatusForError,
    menuOpen,
    allowPaymentByFile,
    allowRefundByFile,
  } = this.state;

  return (
    <div className="border-none">
      <div className="card border-none">
        <div className="border-none">
          <div className="border-none">
            {isApiCalled && (
              <div id="semiTransparenDivTest">
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={true}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
            )}
            {/* <TitleBar title={"Upload"} color={"green"} /> */}
            <PermissionGuard userPermission={PrivilegeConstants.REFUND_FILE_UPLOAD} forcePermission={this.state.privileges[PrivilegeConstants.PAYMENT_FILE_UPLOAD] || this.state.privileges[PrivilegeConstants.REFUND_FILE_UPLOAD]}>
                <div className="row file-type mb-2">
                  <strong className={"my-3 ml-3"} style={{color: 'var(--dark-color)'}}>File Type {isLoading}</strong>
                  <RadioGroup
                    onChange={this.handleChange}
                    value={uploadType}
                    row
                    className={"ml-3"}
                  >
                    <PermissionGuard userPermission={PrivilegeConstants.PAYMENT_FILE_UPLOAD}>
                        <FormControlLabel
                          value="payment"
                          control={<Radio color="primary" />}
                          label="Payment"
                        />
                    </PermissionGuard>
                    <PermissionGuard userPermission={PrivilegeConstants.REFUND_FILE_UPLOAD}>
                        <FormControlLabel
                          id="ReundFileUploadMenu"
                          value="Refund"
                          control={<Radio color="primary" />}
                          label="Refund"
                        />
                    </PermissionGuard>
                  </RadioGroup>
                </div>
                <div>
                  <div className="drop-area">
                    {uploadType === "payment" && allowPaymentByFile && <>
                      <PermissionGuard userPermission={PrivilegeConstants.UPLOAD_PAYMENT_FILE}>
                      <FileInput onDropFile={this.handleFileChange} />
                      </PermissionGuard>
                    </>}
                    {uploadType === "Refund" && allowRefundByFile && <>
                      <PermissionGuard userPermission={PrivilegeConstants.UPLOAD_REFUND_FILE}>
                      <FileInput onDropFile={this.handleFileChange} />
                      </PermissionGuard>
                    </>}
                    {uploadType === "payment" && !allowPaymentByFile && <>
                      <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        Contact assistance and support at benepay.io to upload payments
                      </Alert>
                    </>}
                    {uploadType === "Refund" && !allowRefundByFile && <>
                      <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        Contact assistance and support at benepay.io to upload refunds
                      </Alert>
                    </>}
                  </div>
                  {validationError && validationError.length > 0 && (
                    <Modal
                      open={validationError && validationError.length > 0}
                      onClose={() => {
                        this.setState({ validationError: null });
                      }}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      sx={{ border: "0px solid white", outline: "none !important" }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        border: "none !important",
                        borderRadius: "16px",
                        outline: "none !important",
                      }}
                    >
                      <div
                        className="error-box p-4"
                        style={{
                          background: "white",
                          border: "none !important",
                          borderRadius: "4px",
                          outline: "none !important",
                          maxHeight: "80vh", // Limit the height of the modal content
                          overflowY: "auto", // Enable vertical scrolling
                        }}
                      >
                        <h5 className="text-danger mb-4">
                          File Upload Failed, please find the error details below -
                        </h5>
                        <div
                          style={{
                            listStyle: "none",
                            fontSize: "1.1rem !important",
                            padding: "0 !important",
                          }}
                        >
                          {validationError.map((ve, index) => (
                            <ul
                              key={index}
                              style={{
                                listStyle: "none",
                                fontSize: "1.5rem !important",
                                padding: "0 !important",
                              }}
                            >
                              <li>
                                <span style={{ fontWeight: "500" }}>
                                  Attribute:
                                </span>{" "}
                                {this.getFormattedAttribute(ve)}
                              </li>
                              {uploadType === "payment" && (
                                <li>
                                  <span style={{ fontWeight: "500" }}>Level:</span>{" "}
                                  {ve.level || "File Parsing"}
                                </li>
                              )}
                              <li>
                                <span style={{ fontWeight: "500" }}>
                                  Error Message:
                                </span>{" "}
                                {ve.errorMsg || ve.errorDescription}
                              </li>
                            </ul>
                          ))}
                        </div>
                      </div>
                    </Modal>
                  )}
                  <div className="my-4"
                    style={{ display: "flex", alignContent: "center", justifyContent: "flex-end", columnGap: '10px' }}
                  >
                    <div>
                      {uploadType === "payment" && allowPaymentByFile && <>
                        <PermissionGuard userPermission={PrivilegeConstants.DOWNLOAD_SAMPLE_UPLOAD_FILE}>
                          <button
                          type="button"
                          id="downloadTemplateButton"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "transperent",
                            border: "none",
                            outline: "none",
                            background: "white",
                          }}
                          ref={this.anchorRef}
                          aria-controls={menuOpen ? 'download-menu' : undefined}
                          aria-expanded={menuOpen ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={this.handleToggle}
                        >
                          <button
                            variant="contained"
                            style={{
                              background: 'var(--light-color)',
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              outline: 'none',
                              border: 'none',
                            }}
                          >
                            <FontAwesomeIcon icon={faDownload} color="var(--secondary-color)" />
                          </button>
                          <span
                            style={{
                              marginLeft: '12px',
                              fontSize: 'var(--font-medium)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--primary-color)'
                            }}
                          >
                            Download Template
                          </span>
                          </button>
                        </PermissionGuard>
                      </>}
                      {uploadType === "Refund" && allowRefundByFile && <>
                        <PermissionGuard userPermission={PrivilegeConstants.DOWNLOAD_SAMPLE_UPLOAD_FILE}>
                          <button
                          type="button"
                          id="downloadTemplateButton"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "transperent",
                            border: "none",
                            outline: "none",
                            background: "white",
                          }}
                          ref={this.anchorRef}
                          aria-controls={menuOpen ? 'download-menu' : undefined}
                          aria-expanded={menuOpen ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={this.handleToggle}
                        >
                          <button
                            variant="contained"
                            style={{
                              background: 'var(--light-color)',
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              outline: 'none',
                              border: 'none',
                            }}
                          >
                            <FontAwesomeIcon icon={faDownload} color="var(--secondary-color)" />
                          </button>
                          <span
                            style={{
                              marginLeft: '12px',
                              fontSize: 'var(--font-medium)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--primary-color)'
                            }}
                          >
                            Download Template
                          </span>
                          </button>
                        </PermissionGuard>
                      </>}
                      <Popper
                        open={menuOpen}
                        anchorEl={this.anchorRef.current}
                        role={undefined}
                        placement="bottom-start"
                        transition
                        style={{ height: '20px', textAlign: 'center' }}
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                              background: "#F1F1F1"
                            }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={this.handleMenuClose}>
                                <MenuList
                                  autoFocusItem={menuOpen}
                                  id="download-menu"
                                  aria-labelledby="downloadTemplateButton"
                                  onKeyDown={this.handleListKeyDown}
                                >
                                  <MenuItem onClick={(e) => {
                                    this.handleMenuClose(e);
                                    this.handleTemplateDownload("csv", uploadType)
                                  }}>CSV</MenuItem>
                                  <MenuItem onClick={(e) => {
                                    this.handleMenuClose(e);
                                    this.handleTemplateDownload("xlsx", uploadType)
                                  }}>XLSX</MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </div>
                      
                    <button
                      onClick={() => {
                        this.getUploadedFiles(uploadType, 1);
                      }}
                      type="button"
                      id="dropdownMenuButtonAmount"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "transperent",
                        border: "none",
                        outline: "none",
                        background: "white",
                      }}
                    >
                      <button
                        variant="contained"
                        style={{
                          background: "var(--light-color)",
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          outline: "none",
                          border: "none",
                        }}
                      >
                        <RefreshIcon style={{ color: 'var(--secondary-color)' }} />
                      </button>
                      <span
                        style={{
                          marginLeft: "12px",
                          fontSize: "var(--font-medium)",
                          fontWeight: "var(--font-weight-medium)",
                          color: 'var(--primary-color)'
                        }}
                      >
                        Refresh
                      </span>
                    </button>
                  </div>
                  {uploadedFiles && uploadedFiles.length > 0 ? (
                    <div className="transactions-list my-4" width="100%">
                      <DataGrid
                        rows={uploadedFiles}
                        columns={
                          uploadType === "Refund"
                            ? this.uploadedRefundFiles()
                            : this.uploadedPaymentFiles()
                        }
                        className="serachedPaymentResultGridPagination"
                        rowHeight={86}
                        getRowId={(row) => row.fileId}
                        disableColumnSelector={true}
                        disableColumnMenu={true}
                        disableRowSelectionOnClick
                        disableColumnFilter
                        initialState={{
                          // pagination: {
                          //   paginationModel: {
                          //     pageSize: this.state.pageSize,
                          //   },
                          // },
                        }}
                        sx={{
                          border: 0,
                          boxShadow: 0,
                          width: "100%",
                          "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#1976d233",
                            cursor: "pointer",
                            overflow: "visible !important",
                            zIndex: "50",
                          },
                        }}
                      />
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
                {uploadedFiles && uploadedFiles.length > 0 && (
                  <div
                    id="PaginationWithDetails"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "32px",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={6}
                        display="flex"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          style={{ color: "#6654C3", width: "100%" }}
                        ></Typography>
                      </Grid>
                    </Grid>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "var(--light-color)",
                          height: "auto",
                          padding: "8px 16px",
                          borderRadius: "7px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={this.state.totalPages}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={this.handlePageChangePayment}
                            containerClassName={
                              "pagination justify-content-end my-auto"
                            }
                            pageClassName={"page-item bg-transparent border-0"}
                            pageLinkClassName={
                              "page-link rounded-lg mx-1 bg-transparent border-0"
                            }
                            previousClassName={"page-item bg-transparent border-0"}
                            previousLinkClassName={
                              "page-link rounded-lg mr-2 bg-transparent border-0"
                            }
                            nextClassName={"page-item bg-transparent border-0"}
                            nextLinkClassName={
                              "page-link rounded-lg ml-2 bg-transparent border-0"
                            }
                            breakClassName={
                              "page-item rounded-lg mx-1 bg-transparent border-0"
                            }
                            breakLinkClassName={
                              "page-link rounded-lg bg-transparent border-0"
                            }
                            activeClassName={"active bg-primary rounded-lg"}
                            forcePage={this.state.initalPage}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            minWidth: "200px",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "8px",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "var(--font-x-small)",
                              fontWeight: "var(--font-weight-medium)",
                              color: "var(--accent-color)",
                              margin: "3px 5px 0px 0px",
                            }}
                          >
                            Go to Page
                          </h5>
                          <input
                            min={1}
                            max={this.state.totalPages}
                            style={{
                              width: "56px",
                              background: "white",
                              padding: "4px",
                              border: "1px solid var(--accent-color)",
                              textAlign: "center",
                            }}
                            type="number"
                            placeholder={1}
                            className="form-control"
                            value={this.state.pageNoForRedirect}
                            onChange={(e) =>
                              this.setState({
                                pageNoForRedirect: e.target.value.replace(/[^0-9.]/g, ''),
                              })
                            }
                          />
                          <button
                            onClick={() => {
                              this.handlePageChangePayment({
                                selected: Number(this.state.pageNoForRedirect) - 1,
                              });
                            }}
                            style={{
                              fontSize: "var(--font-large)",
                              marginLeft: "4px",
                              fontWeight: "var(--font-weight-normal)",
                              background: "#00000000",
                              outline: "none",
                              border: "none",
                            }}
                          >
                            <span style={{ color: "var(--accent-color)" }}>
                              <FontAwesomeIcon icon={faAnglesRight} />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </PermissionGuard>
  
            <ErrorModel 
              isOpen={errorDetailsModel && refundErrors && refundErrors.length > 0}
              closeModel={() => {this.setState({errorDetailsModel: false,refundErrors: []})}}
              refundErrors={refundErrors}
              selectedStatusForError={selectedStatusForError}
              uploadType={uploadType}
              csvData={csvData}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

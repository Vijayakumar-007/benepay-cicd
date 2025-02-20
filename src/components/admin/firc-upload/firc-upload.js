import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, FormGroup, FormControlLabel, FormControl, Checkbox, Card, Stack, FormHelperText, InputAdornment, CardContent, Button } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquareFull, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import "./firc-upload.scss"
import Loader from 'components/$widgets/loader';
import { toast } from 'react-toastify';
import TitleBar from 'components/title-bar/title-bar';
import { DashboardService } from 'service/api/dashboard.service';
import { DataGrid } from "@mui/x-data-grid";
import Upload from './support-components/upload';

const FIRCUpload = (props) => {

    const [loading, setLoading] = useState(false);
    const [benepayTransactionId, setBenepayTransactionId] = useState("");
    const [paymentList, setPaymentList] = useState([]);
    const [uploadFileList, setUploadFileList] = useState([]);
    let [tableContent, setTableContent] = useState([]);

    useEffect(() => {
        if(props && props.history && props.history.location && props.history.location.transactionId){
            setBenepayTransactionId(props.history.location.transactionId);
            getPaymentsData();
        }
    }, [props])

    useEffect(() => {
        if(benepayTransactionId.length == 0){
            setPaymentList([]); setUploadFileList([]);
        }
    }, [benepayTransactionId])


    let getPaymentsData = async () => {
        if (benepayTransactionId.length != 0) {
            setLoading(true);
            let result = await DashboardService.getManualPayments(benepayTransactionId);
            setLoading(false);

            if (result && result.length > 0) {
                let newUploadList = [];
                result.map(() => {
                    newUploadList.push(null);
                });
                setUploadFileList(newUploadList);
                setPaymentList(result);
                setTableContent([
                    {
                        field: "paymentId",
                        headerName: "Payment Id",
                        headerClassName: "tableHeaderStyle",
                        cellClassName: "table-cell-classname",
                        flex: 1,
                        maxWidth: 140,
                    },
                    {
                        field: "transactionId",
                        headerName: "Transaction Id",
                        headerClassName: "tableHeaderStyle",
                        cellClassName: "table-cell-classname",
                        flex: 1,
                        minWidth: 140,
                        maxWidth: 200,
                    },
                    {
                        field: "paymentAmount",
                        headerName: "Amount",
                        maxWidth: 140,
                        headerClassName: "tableHeaderStyle",
                        cellClassName: "table-cell-classname",
                        flex: 1,
                    },
                    {
                        field: "paymentCompletionTimestamp",
                        headerName: "Completion Timestamp",
                        minWidth: 140,
                        headerClassName: "tableHeaderStyle",
                        cellClassName: "table-cell-classname",
                        flex: 1,
                    },
                    {
                        field: "upload",
                        headerName: "Upload",
                        align: "left",
                        headerAlign: "left",
                        headerClassName: "tableHeaderStyle",
                        cellClassName: "table-cell-classname-actions",
                        flex: 1,
                        minWidth: 250,
                        maxWidth: 350,
                        disableColumnMenu: true,
                        sortable: false,
                        border: 0,
                        renderCell: (params) => {
                            return (
                                <Upload
                                    params={params}
                                    uploadFileList={uploadFileList}
                                    setUploadFileList={setUploadFileList}
                                    toast={toast}
                                    index={0}
                                />
                            );
                        },
                    }
                ])
            } else {
                toast.error("Unable to find the manual payments for given benepay transaction id");
            }
        }
    }

    let saveFIRCFiles = async () => {
        let count = 0;
        uploadFileList.forEach(element => {
            if (element) {
                count++;
            }
        });
        let isValid = uploadFileList.length > 0 && count >= 1;
        if (isValid) {
            setLoading(true);
            let result = await DashboardService.saveFircFiles(uploadFileList);
            setLoading(false);
            if (result) {
                result.isManualPaymentUpdated ? toast.success(result.message) : toast.error(result.message);
                console.log(result.isManualPaymentUpdated);
                if (result.isManualPaymentUpdated) {
                    setBenepayTransactionId("");
                    setUploadFileList([]);
                    setPaymentList([]);
                }
            }
        }else{
            toast.error("Atleast update one file to proceed!")
        }
    }

    return (
        <>
            <Loader loading={loading} />
            <TitleBar
                className={"mt-3"}
                color="blue"
                ruleColor="blue"
                title={"FIRC File Upload"}
            />
            <Grid container mt={1} spacing={1}>
                <Grid item xs={12} md={4} xl={2}>
                    <label
                        htmlFor="benePayTransactionId"
                        className="py-1"
                        style={{
                            whiteSpace: "nowrap",
                            fontWeight: "var(--font-weight-normal)",
                            fontSize: "var(--font-x-medium)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: 'var(--dark-color)'
                        }}
                        onClick={() => console.log(uploadFileList)}
                    >
                        BenePay Transaction Id
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={benepayTransactionId}
                        onChange={(e) => setBenepayTransactionId(e.target.value)}
                    />
                </Grid>
            </Grid>
            <div
                className="d-flex justify-content-start"
                style={{ margin: "24px 0px" }}
            >
                <span style={{ marginRight: "60px" }}>
                    <button
                        onClick={() => { getPaymentsData(); }}
                        style={{
                            padding: "8px 24px",
                            marginRight: "8px",
                            color: "var(--light-color)",
                            fontWeight: "var(--font-weight-normal)",
                            fontSize: "var(--font-x-medium)",
                            width: "154px",
                            background: "var(--accent-color)",
                            outline: "none",
                            border: "none",
                            borderRadius: "4px",
                        }}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => { setBenepayTransactionId(""); setPaymentList([]); setUploadFileList([]);}}
                        style={{
                            padding: "8px 24px",
                            fontWeight: "var(--font-weight-normal)",
                            fontSize: "var(--font-x-medium)",
                            width: "154px",
                            background: "var(--light-color)",
                            outline: "none",
                            border: "none",
                            borderRadius: "4px",
                            color: 'var(--accent-color)'
                        }}
                    >
                        Clear
                    </button>
                </span>
            </div>

            {benepayTransactionId && paymentList && paymentList.length > 0 && <>
                <DataGrid
                    rows={paymentList}
                    columns={tableContent}
                    className="serachedPaymentResultGridPagination"
                    getRowId={(row) => row.paymentId} // Use a field that uniquely identifies each row
                    disableColumnSelector={true}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    rowsPerPage={10}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    sx={{
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#1976d233",
                            cursor: "pointer",
                        },
                    }}
                />

                <div
                    className="d-flex justify-content-start"
                    style={{ margin: "24px 0px" }}
                >
                    <span style={{ marginRight: "60px" }}>
                        <button
                            onClick={() => { saveFIRCFiles(); }}
                            style={{
                                padding: "8px 24px",
                                marginRight: "8px",
                                color: "var(--light-color)",
                                fontWeight: "var(--font-weight-normal)",
                                fontSize: "var(--font-x-medium)",
                                width: "154px",
                                background: "var(--accent-color)",
                                outline: "none",
                                border: "none",
                                borderRadius: "4px",
                            }}
                        >
                            Update
                        </button>
                    </span>
                </div>

            </>}

        </>
    )
}

export default FIRCUpload;
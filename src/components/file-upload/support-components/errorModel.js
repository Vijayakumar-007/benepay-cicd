import React from "react";
import {
  Container,
  Grid,
  Chip,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import ConfirmDialog from "../../$widgets/dialog";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import { DateFormat } from "../../../enum/common.enum";
import { Close, DownloadForOffline } from "@mui/icons-material";

const ErrorModel = ({
  isOpen,
  closeModel,
  refundErrors,
  selectedStatusForError,
  uploadType,
  csvData,
}) => {
  return (
    <>
      {isOpen && (
        <>
          <ConfirmDialog open={true} setOpen={true}>
            <Container maxWidth="sm">
              <Grid container rowSpacing={1}>
                <Grid item xs={10}>
                  <>
                    <Typography
                      variant="body1"
                      fontSize={20}
                      fontWeight={600}
                      style={{ color: "#0D5AB7" }}
                    >
                      {uploadType === "Refund" ? "Refund" : "Payment"} File
                      Upload Error Summary
                    </Typography>
                  </>
                </Grid>
                <Grid
                  item
                  xs={2}
                  style={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <IconButton size="medium" onClick={closeModel}>
                    <Close />
                  </IconButton>
                </Grid>
              </Grid>
            </Container>

            <Divider
              variant="middle"
              style={{ marginTop: "3%", borderWidth: "1px" }}
            />

            {refundErrors.map((data, i) => {
              return (
                <>
                  <Container maxWidth="sm">
                    <Grid container rowSpacing={2} marginTop={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          File Id
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        {data.refId}
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Input Request
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <p style={{ wordWrap: "break-word" }}>
                          {data.inputRequest}
                        </p>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Error Code
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <p style={{ wordWrap: "break-word" }}>
                          {data.errorCode}
                        </p>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Received TimeStamp
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <p style={{ wordWrap: "break-word" }}>
                          {(data.receivedDate)}
                        </p>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          fontSize={15}
                          fontWeight={400}
                        >
                          Error Description
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <p style={{ wordWrap: "break-word" }}>
                          {data.errorDesc}
                        </p>
                      </Grid>
                    </Grid>
                  </Container>
                  <Divider
                    variant="middle"
                    style={{ marginTop: "3%", borderWidth: "1px" }}
                  />
                </>
              );
            })}

            <div
              className="download-btn d-flex"
              style={{
                height: "15px",
                marginTop: "3%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {selectedStatusForError === "INVALID" ? (
                <Typography fontSize={15} fontWeight={400}>
                  Please correct above error and update file name.
                </Typography>
              ) : <div></div>}
              {csvData && csvData.data && (
                <CSVLink {...csvData}>
                  <Chip
                    sx={{ padding: 1 }}
                    icon={<DownloadForOffline />}
                    label="Download Error File"
                    clickable
                    color="primary"
                  />
                </CSVLink>
              )}
            </div>
          </ConfirmDialog>
        </>
      )}
    </>
  );
};

export default ErrorModel;

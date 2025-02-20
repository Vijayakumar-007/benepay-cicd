/**
 * Merchant Dashboard component HTML
 *
 * @author Muthukumaran
 */
import React, { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  FormLabel
} from "@mui/material";
import { withStyles } from "@material-ui/styles";
import { styled } from "@mui/material/styles";

import "./merchant-dashboard.css";

import Pie3D from "./charts/pie-3D";
import Conversion from "./charts/conversion";
import AgeingBar from './charts/ageing-bar';
import Settlement from "./charts/settlement";
import Broadcast from "./broadcast/broadcast";
import Loader from "components/$widgets/loader";

export function html() {
  const {
    activitySummary,
    ageingSummary,
    conversionSummary,
    settlement30days,
    settlement1year,
    expirySummary,
    demographyData,
    methodsData,
    loading,
  } = this.state;
  
  const CardHead = styled(FormLabel)(({ theme }) => ({
      marginBottom: 15,
      color: "rgb(38, 77, 115)",
  }));

  const PaperBox = styled(Paper)(({ theme }) => ({
    paddingTop:'2%',
    paddingBottom:'1%',
    textAlign: "center",
    background: "black",
    color: "white",
  }));

  return (
    <Box>
     <Loader loading={loading} />
      <Grid container mt={2} >
        <Grid item xs={12}>
          <Broadcast />
        </Grid>
        
        <Grid item mt={2} xs={12}>
          <Card>
            <CardContent>

              <CardHead gutterBottom>
                <h5>Today's Activity Summary (No. of Payments)</h5>
              </CardHead>
              {activitySummary && (
                <Grid container spacing={3} mt={2}>
                  <Grid item lg={2} md={6} sm={6} >
                    <PaperBox square={false} sx={{background:'#9376E0'}}>
                      <h5>Initiated</h5>
                      <h4 style={{ textAlign: "center" }}>
                        {activitySummary.initiated}
                      </h4>
                    </PaperBox>
                  </Grid>

                  <Grid item lg={2} md={6} sm={6} >
                    <PaperBox square={false} sx={{background:'#10A19D'}}>
                      <h5>Paid</h5>
                      <h4 style={{ textAlign: "center" }}>
                        {activitySummary.paid}
                      </h4>
                    </PaperBox>
                  </Grid>

                  <Grid item lg={2} md={6} sm={6} >
                    <PaperBox square={false} sx={{background:'#C21292'}}>
                      <h5>Settled</h5>
                      <h4 style={{ textAlign: "center" }}>
                        {activitySummary.settled}
                      </h4>
                    </PaperBox>
                  </Grid>

                  <Grid item lg={2} md={6} sm={6} >
                    <PaperBox square={false} sx={{background:'#FFA732'}}>
                      <h5>Cancelled</h5>
                      <h4 style={{ textAlign: "center" }}>
                        {activitySummary.cancelled}
                      </h4>
                    </PaperBox>
                  </Grid>

                  <Grid item lg={2} md={6} sm={6} >
                    <PaperBox square={false} sx={{background:'#F6635C'}}>
                      <h5>Expired</h5>
                      <h4 style={{ textAlign: "center" }}>
                        {activitySummary.expired}
                      </h4>
                    </PaperBox>
                  </Grid>

                  <Grid item lg={2} md={6} sm={6} >
                    <PaperBox square={false} sx={{background:'#810CA8'}}>
                      <h5>Refunded</h5>
                      <h4 style={{ textAlign: "center" }}>
                        {activitySummary.refunded}
                      </h4>
                    </PaperBox>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container mt={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CardHead gutterBottom>
                <h5>Payment Requests Nearing Expiry</h5>
              </CardHead>

              <Grid container mt={4}>
                <Grid item xs={12}>
                  <AgeingBar
                    key={2}
                    data={expirySummary}
                    dots={false}
                    height="55"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container mt={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CardHead gutterBottom>
                <h5>Conversions in last one year</h5>
              </CardHead>

              <Grid container mt={2} spacing={5}>
                <Grid item lg={6} md={12} sm={12}>
                  <Conversion type="volume" title="Conversion Volume" data={conversionSummary.volume ?? conversionSummary.volume} />
                </Grid>

                <Grid item lg={6} md={12} sm={12}>
                  <Conversion type="value" title="Conversion Value" data={conversionSummary.value ?? conversionSummary.value} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container mt={4}>
        <Grid item xs={12}>
          
          {/* <Grid container spacing={2}>
            <Grid item lg={6} md={12} sm={12}>
              <Card>
                <CardContent>
                  <CardHead gutterBottom>
                    <h5>Settlement trend - last 30 days (Amount in INR)</h5>
                  </CardHead>

                  <CardContent>
                    <Settlement mt={5} data={settlement30days} />
                  </CardContent>
                </CardContent>
              </Card>
            </Grid> 
            
            <Grid item lg={6} md={12} sm={12}>
              <Card>
                <CardContent>
                  <CardHead gutterBottom>
                    <h5>Settlement trend - last one year (Amount in INR)</h5>
                  </CardHead>

                  <CardContent>
                    <Settlement mt={5} data={settlement1year} />
                  </CardContent>
                </CardContent>
              </Card>
            </Grid>
          </Grid> */}
          
        </Grid>
      </Grid>
      
      <Grid container mt={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CardHead gutterBottom>
                <h5>Ageing (Outstanding Payment Requests)</h5>
              </CardHead>

              <Grid container mt={4}>
                <Grid item xs={12}>
                  <AgeingBar
                    key={1}
                    data={ageingSummary}
                    dots={true}
                    height="10"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container mt={4}>
        <Grid item xs={12}>
          
          <Grid container spacing={2}>
            <Grid item lg={6} md={12} sm={12}>
              <Card>
                <CardContent>
                  <Grid container>
                    <Grid item xs={12}>
                      <CardHead gutterBottom>
                        <h5>Payer Demography (All Time)</h5>
                      </CardHead>

                      <CardContent>
                        <Pie3D data={demographyData} elemId="pieChart1" />
                      </CardContent>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid> 
            
            <Grid item lg={6} md={12} sm={12}>
              <Card>
                <CardContent>
                  <Grid container>
                    <Grid item xs={12}>
                      <CardHead gutterBottom>
                        <h5>Payment Methods (All Time)</h5>
                      </CardHead>

                      <CardContent>
                        <Pie3D data={methodsData} elemId="pieChart2" />
                      </CardContent>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </Box>
  );
}

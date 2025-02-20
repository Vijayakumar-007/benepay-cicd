import React, { Component, useEffect, useState } from 'react';
import { Auth } from "aws-amplify";
import { DashboardService } from "../../service/api/dashboard.service";
import { StorageKeys, StorageService } from "../../service/core/storage.service";

import { html } from "./merchant-dashboard.html";

/**
 * Component for process Merchant Dashboard
 *
 * @author Muthukumaran
 */
export default class MerchantDashboard extends Component {

  // form fields declaration
  fieldNames = [];

  amountFields = [];

  // define rules for each fields in Mercant Dashboard transaction form
  rules = {};

  /**
   * Constructor for Mercant Dashboard
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      activitySummary: {},
      ageingSummary: {},
      conversionSummary: {},
      settlement30days: {},
      settlement1year: {},
      expirySummary: {},
      demographySummary: {},
      methodSummary: {},
      demographyData: [],
      methodsData: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true }); 
    Auth.currentSession().then(res => {
        let jwt = res["idToken"]["jwtToken"]
        StorageService.set(StorageKeys.clientJwt, jwt);

        this.initDashboard();
    })
  }

  initDashboard(){
    this.getActivitySummaryList();
    this.getAgeingSummaryList();
    this.getConversionSummaryList();
    this.getSettlement30daysList();
    this.getSettlement1yearList();
    this.getExpirySummaryList();
    this.getDemographySummaryList();
    this.getMethodSummaryList();
  }

  getActivitySummaryList = async () => {
    const result = await DashboardService.getActivitySummary();

    if( result ){
      this.setState({ activitySummary: result });
    }
  };

  getAgeingSummaryList = async () => {
    const result = await DashboardService.getAgeingSummary();

    if (result && result.aging) {
      this.setState({ ageingSummary: result.aging });
    }
  };

  getConversionSummaryList = async () => {
    const result = await DashboardService.getConversionSummary();
    
    if( result ){
      this.setState({ conversionSummary: result });
    }
  };

  getSettlement30daysList = async () => {
    const result = await DashboardService.getSettlement30days();

    if (result !== null) {
      this.setState({ settlement30days: result });
    };
  };

  getSettlement1yearList = async () => {
    const result = await DashboardService.getSettlement1year();

    if (result !== null) {
      this.setState({ settlement1year: result });
    };
  };

  getExpirySummaryList = async () => {
    const result = await DashboardService.getExpirySummary();

    if (result && result.expiry) {
      this.setState({ expirySummary: result.expiry });
    }
  };

  getDemographySummaryList = async () => {
    const result = await DashboardService.getDemographySummary();

    const data = [];
    
    if (result) {
      result.forEach((item) => {
        data.push({ label: item.country, value: item.value })
      });

      this.setState({ demographyData: data, demographySummary: result });
    }
  };

  getMethodSummaryList = async () => {
    const result = await DashboardService.getMethodSummary();

    const data = [];

    if (result) {
      result.forEach((item) => {
        data.push({ label: item.method, value: item.count });
      })

      this.setState({ methodsData: data, methodSummary: result });
    }
    this.setState({ loading: false }); 
  }

  render = () => html.apply(this);
}

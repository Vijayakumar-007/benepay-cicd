import React, { Component, useState } from 'react'
import { html } from './settlement.html'
import { DashboardService } from "../../service/api/dashboard.service";
import moment from "moment";
import { toast } from 'react-toastify';
import { DefaultDateFormat } from 'config/constants';


class Settlement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            settlementDate: '',
            noSettlementReportFoun: false
        }
    }
    downloadSettlementFile = async () => {
        var searchObj = {
            settlementDate: this.state.settlementDate,
        }
        if (this.state.settlementDate) {
            searchObj.settlementDate = moment(this.state.settlementDate).format(DefaultDateFormat.dateFormat)
        }
        this.setState({
            loading: true
        })
        const response = await DashboardService.downloadTransactionsReport(searchObj, 'settlement')
        this.setState({
            loading: false,
        })
        if (!response) {
            this.setState({
                noSettlementReportFound: true
            });
        }
        if (response) {
            if (!response.fileName) {
                toast.info('Requested File not found');
                return
            }
            var blob = this.base64toBlob(response.content, 'text/csv')
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveOrOpenBlob(blob, response.fileName + '.csv');
            }
            else {
                var a = window.document.createElement("a");
                a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
                a.download = response.fileName + '.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }

    base64toBlob = function (base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        //var byteCharacters = decodeURIComponent(escape(window.atob(base64Data)))
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    clearSettlement = async () => {
        this.setState({
            settlementDate: null,
            noSettlementReportFound: false
        })
    }

    render = () => html.apply(this)
}

export default Settlement
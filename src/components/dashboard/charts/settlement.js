import React, { Component } from 'react';

import { Line } from "react-chartjs-2";

export default class Settlement extends Component {

    nodata = true;

    chartData = {
        labels: [],
        datasets: [
            {
                label: "Settlements",
                backgroundColor: "#658eec",
                borderColor: "#658eec",
                data: [],
                lineTension: 0,
            },
        ],
    }

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevState, prevProps) {
        this.nodata = true;

        this.prepareData(this.props);
    }

    componentDidMount() {
        
    }

    prepareData = (props) => {
        if (!(props && props.data && Object.keys(props.data).length > 0 && props.data.settlement && Object.keys(props.data.settlement).length > 0)) {
            return;
        }

        let labels = [];
        let data = [];
        
        props.data.settlement.forEach(entry => {
            labels.push(entry.label);
            data.push(entry.value);
        });      

        this.chartData.labels = labels;
        this.chartData.datasets[0].data = data;
        
        if(data.length > 0){
            this.nodata = false;
        }
    }

    render() {
        return (
            <div className="chart-container">
                { this.nodata ? <div className="nodata">No Data</div>: <Line data={this.chartData} /> }
            </div>
        );
    }
};
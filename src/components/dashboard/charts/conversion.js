import React, { Component } from 'react';
import { Line, Bar } from "react-chartjs-2";

export default class Conversion extends Component {

    baseData = {
        labels: [],
        datasets: [
            {
                label: "Requested",
                backgroundColor: "#658eec",
                borderColor: "#658eec",
                data: []
            },
            {
                label: "Collected",
                backgroundColor: "#CC5500",
                borderColor: "#CC5500",
                data: []
            },
        ]
    }

    constructor(props) {
        super(props);

        this.state = {
            noData: true,
            chartData: this.baseData,
            title: props.title,
            chartType: props.type,
            initialData: props.data
        }
    }

    componentDidMount() {
        this.prepareChartData();
    }

    componentDidUpdate(prevProps, prevState) {
        try {
            if (this.props.data !== prevProps.data) {
                this.setState({ initialData: this.props.data }, () => {
                    this.prepareChartData();
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    prepareChartData = () => {
        console.log("this.state.initialData",this.state.initialData);
        if (!this.state.initialData) {
            return;
        }

        let labelRequested = "", labelCollected = "", fill = true;

        if (this.state.chartType == "volume") {
            labelRequested = "Requested Payments";
            labelCollected = "Collected Payments";
            fill = false;
        } else {
            labelRequested = "Requested Values";
            labelCollected = "Collected Values";
        }

        this.state.chartData.datasets[0].label = labelRequested;
        this.state.chartData.datasets[1].label = labelCollected;

        this.state.chartData.datasets[0].fill = fill;
        this.state.chartData.datasets[1].fill = fill;

        this.state.chartData.datasets[0].data = [];
        this.state.chartData.datasets[1].data = [];
        
        this.state.initialData.requested && this.state.initialData.requested.forEach((item) => {
            this.state.chartData.labels.push(item.label);
            this.state.chartData.datasets[0].data.push(item.value);
        });

        this.state.initialData.collected && this.state.initialData.collected.forEach((item) => {
            this.state.chartData.datasets[1].data.push(item.value);
        });

        if( this.state.chartData.labels.length > 0 ){
            this.state.noData = false;
        }

        console.log({ chartData: this.state.chartData, noData: this.state.noData });
        this.setState({ chartData: this.state.chartData, noData: this.state.noData });
    }

    render() {
        return (
            <div className="chart-container">
                <h6 style={{ textAlign: "center" }}>{this.state.title}</h6>
                {
                    this.state.noData ? <div className="nodata">No Data</div> 
                        : this.state.chartType == "volume"
                            ? <Line data={this.state.chartData} />
                            : <Bar data={this.state.chartData} />
                }
            </div>
        );
    }
};
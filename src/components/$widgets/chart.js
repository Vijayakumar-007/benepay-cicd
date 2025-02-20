import React from 'react';
import {Bar, HorizontalBar, Pie, Doughnut, defaults} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const barGraphData = {
    labels: ['Awaiting Claim', 'Accepted', 'Rejected', 'Claimed', 'Expired', 'Cancelled', 'Returned'],
    datasets: [
        {
            label: 'Payment Statuses (As of Date)',
            backgroundColor: ' #2d466a',
            borderColor: ' #2d466a',
            borderWidth: 1,
            hoverBackgroundColor: '#0B2D6A',
            hoverBorderColor: '#0B2D6A',
            data: []
        }
    ],
};

const horizontalData = {
    labels: ['Today', '1 - 3 Days', '4 - 7 Days', '8 - 15 Days', '16 - 30 Days', "> 30 days"],
    datasets: [
        {
            label: 'Payments Nearing Expiry',
            backgroundColor: ["#ff2500", "#ff968d", "#feae00", "#88fa4f", "#5e9c44", "#5e9c44"],
            borderWidth: 1,
            data: []
        }
    ],
};

function BarGraph(props) {
    const paymentStatus = [];
    for (let k in props.data) {
        paymentStatus.push(props.data[k]);
    }
    paymentStatus.shift();
    paymentStatus.splice(paymentStatus.length - 1, 1);
    barGraphData.datasets[0].data = paymentStatus;

    const gridLineOptions = {
        color: "rgba(0, 0, 0, 0.5)",
        display: true,
        borderDashOffset: 0,
        // drawBorder: true,
        tickMarkLength: 0,
        zeroLineColor: "rgba(0, 0, 0, 1)",
        zeroLineWidth: 2,
    }
    console.log('defaults', defaults.global);
    return (
        <>
            <Bar height={'100%'} data={{
                labels: barGraphData.labels,
                datasets: barGraphData.datasets
            }}
                 options={{
                     maintainAspectRatio: false,

                     scales: {
                         yAxes: [{
                             ticks: {
                                 padding: 20
                             },
                             gridLines: {
                                 ...gridLineOptions,
                             }
                         }],
                         xAxes: [{
                             ticks: {
                                 padding: 20
                             },
                             gridLines: {
                                 // ...gridLineOptions,
                                 zeroLineWidth: 0,
                                 // zeroLineColor: 'white',
                                 display: false,
                             }
                         }],
                     },
                     legend: {
                         labels: {
                             fontColor: "#ff6a00",
                             fontStyle: "bold"
                         }
                     },
                     plugins: {
                         datalabels: {
                             display: true,
                             color: '#fff'
                         }
                     }
                 }}
            />
        </>
    )
}

function HorizontalBarGraph(props) {
    const nearExpiryPayments = [];
    for (let k in props.data) {
        nearExpiryPayments.push(props.data[k]);
    }
    const gridLineOptions = {
        color: "rgba(0, 0, 0, 0.5)",
        display: true,
        borderDashOffset: 0,
        drawBorder: true,
        tickMarkLength: 0,
        zeroLineColor: "rgba(0, 0, 0, 1)",
        zeroLineWidth: 2,
    }

    horizontalData.datasets[0].data = nearExpiryPayments;
    let colors = [];
    let width = [];
    new Array(7).fill().forEach((__, index) => {
        if (index === 6) {
            colors.push('rgba(0,0,0,1)');
            width.push(2)
        } else {
            colors.push('rgba(0,0,0,0)');
            width.push(0)
        }
    })
    return (
        <HorizontalBar data={{
            labels: horizontalData.labels,
            datasets: horizontalData.datasets
        }} options={{
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        padding: 20
                    },
                    gridLines: {
                        ...gridLineOptions,
                        color: colors,
                        lineWidth: width,
                        zeroLineWidth: 0
                    }
                }],
                xAxes: [{
                    ticks: {
                        padding: 20,
                        display: false
                    },
                    gridLines: {
                        ...gridLineOptions,
                        color: 'rgba(0,0,0,0)'
                    }
                }],
            },
            plugins: {
                datalabels: {
                    display: true,
                    color: '#fff'
                }
            }
        }}/>
    )
}

function PieChart(props) {
    const data = props.data;

    const pieChartData = {
        datasets: [{
            data: [],
            backgroundColor: ["red", "purple", "skyblue"]
        }],
        labels: []
    };

    data.map((d) => {
        pieChartData.labels.push(d["continent"]);
        pieChartData.datasets[0].data.push(d["percentage"]);
    });

    return (
        <>
            <Pie data={pieChartData}
                 options={{
                     plugins: {
                         datalabels: {
                             display: true,
                             color: '#fff'
                         }
                     },
                     responsive: true,
                     maintainAspectRatio: false,
                 }}
            />
        </>
    )
}

function DoughnutChart(props) {
    const doughnutChartData = {
        datasets: [{
            data: [],
            backgroundColor: ["green", "purple"],
        }],
        labels: []
    };

    const data = props.data;
    data.map((d) => {
        doughnutChartData.labels.push(d["currency"]);
        doughnutChartData.datasets[0].data.push(d["percentage"]);
    });
    return (
        <>
            <Doughnut data={doughnutChartData}
               options={{
                   plugins: {
                       datalabels: {
                           display: true,
                           color: '#fff'
                       }
                   },
                   responsive: true,
                   maintainAspectRatio: false
               }}
            />
        </>
    )
}


export {
    BarGraph,
    HorizontalBarGraph,
    PieChart,
    DoughnutChart
}

// const data = {
//     labels: ["1 May 2020","15 May 2020", "25 May 2020", "31 May 2020"],
//     datasets: [
//         {
//             label: "Transaction Value(£)",
//             data: [2000, 2998, 25016, 450]
//         }
//     ]
// };
//
// const options = {
//     scales: {
//         yAxes: [{
//             display: false
//         }]
//     }
// };
//
// function PieChart(props) {
//     const labels = ['Expired Payments', 'Outstanding Payments', 'Claimed Payments'];
//     const datasets = [{
//         data: props.data,
//         backgroundColor: props.colors
//     }];
//     return (
//         <div>
//             <Pie data={{
//                 labels: props.labels,
//                 datasets: datasets
//             }}
//                  height={'100%'}
//                  width={'100%'}
//             />
//             <br/>
//         </div>
//     )
// }
//
// function LineChart() {
//     return (
//         <div>
//             <Line data={data} options={options}/>
//         </div>
//     )
// }
//
// export {
//     PieChart,
//     LineChart
// };

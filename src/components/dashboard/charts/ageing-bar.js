import React, { Component } from 'react';

export default class AgeingBar extends Component {

    colors = ["#74d200", "#98ad15", "#f8b202", "#ff9a00", "#ff4d00", "#ff0000"];

    ageingData = [
        {
            key: "today",
            label: "Today",
            count: 0,
            value: 10,
            primary: "#74d200",
            secondary: "#98ad15",
        },
        {
            key: "1to5",
            label: "1-5 Days",
            count: 0,
            value: 25,
            primary: "#98ad15",
            secondary: "#f8b202",
        },
        {
            key: "6to15",
            label: "6-15 Days",
            count: 0,
            value: 25,
            primary: "#f8b202",
            secondary: "#ff9a00",
        },
        {
            key: "16to30",
            label: "16-30 Days",
            count: 0,
            value: 25,
            primary: "#ff9a00",
            secondary: "#ff4d00",
        },
        {
            key: "above30",
            label: "Above 30 Days",
            count: 0,
            value: 15,
            primary: "#ff4d00",
            secondary: "#ff0000",
        },
    ];

    constructor(props) {
        super(props);

        this.showCircle = props.dots;
        this.barHeight = props.height;
        this.bars;
        this.counts;
        this.dots;
        this.legends;
    }

    componentDidUpdate(prevState, prevProps) {
        this.prepareElements(this.props);
    }

    componentDidMount() {
        this.prepareElements();
    }

    prepareData = (values) => {
        // reversing the colors for expiry bar
        let barColors = this.showCircle ? this.colors : this.colors.slice().reverse();

        return this.ageingData.map((ageing, i) => {
            const matchingItem = values.find((item) => item.key === ageing.key);
            
            ageing.primary = barColors[i];
            ageing.secondary = barColors[i + 1];
            
            if (matchingItem) {
                ageing.count = matchingItem.value;
            }
            
            return ageing;
        });
    }

    prepareElements = (props) => {
        let ageData = this.ageingData;

        if (props && props.data && props.data.length > 0) {
            ageData = this.prepareData(props.data);
        }

        let itemCount = ageData.length - 1;

        this.dots = ageData.map((item, i) => {
            let styles = { fontSize: 30, background: item.secondary };
            if (i == 0) {
                styles.background = item.primary;
            } else {
                if (itemCount == i) {
                    styles.marginLeft = "24.5%";
                } else {
                    styles.marginLeft = "22.5%";
                }
            }

            return <div className="dot" style={styles}></div>;
        });

        this.legends = ageData.map((item, i) => {
            let styles = {};

            if (itemCount == i) {
                styles.textAlign = "right";
                styles.width = "10%"
            } else {
                styles.textAlign = "left";
                styles.width = "22.5%"
            }

            return (
                <div className="legend" style={styles} key={i}>
                    {this.showCircle ? <span>{item.label}</span> : null}
                </div>
            );
        });

        this.counts = ageData.map((item, i) => {
            let styles = {};

            if (itemCount == i) {
                styles.textAlign = "right";
                styles.width = "14%"
            } else {
                styles.textAlign = "center";
                styles.width = "24%"
            }

            if (i == 0) {
                styles.textAlign = "left";
                styles.width = "13%"
            }

            if (item.value > 0) {
                return (
                    <div className="count" style={styles} key={i}>
                        {this.showCircle ? <span>{item.count}</span> : null}
                    </div>
                );
            }
        });

        this.bars = ageData.map((item, i) => {

            if (item.value > 0) {
                let barContent = [];

                if (!this.showCircle) {

                    let styles = {};
                    let styles1 = {};

                    if (itemCount == i) {
                        styles.textAlign = "right"
                        styles1.textAlign = "right"
                        styles.padding = "2px 10px 0px 10px"
                        styles1.padding = "1px 45px 0px 0px"
                    } else {
                        styles.textAlign = "center"
                        styles1.textAlign = "center"
                        styles.padding = "2px 0px 0px 22px"
                        styles1.padding = "1px 0px 0px 37px"
                    }

                    if (i == 0) {
                        styles.textAlign = "left"
                        styles1.textAlign = "left"
                    }

                    barContent.push(
                        <div className="legend-count-inside" key={`legend-count-${i}`}>
                            <div className="upper-content" style={styles}>{item.label}</div>
                            {item.value > 0 && <div className="lower-content" style={styles1}>{item.count}</div>}
                        </div>
                    );
                }

                return (
                    <div
                        className="bar"
                        style={{
                            background: `linear-gradient(to right, ${item.primary}, ${item.secondary})`,
                            width: `${item.value}%`,
                            height: `${this.barHeight}px`,
                            position: 'relative', // To position content inside the bar
                        }}
                        key={i}
                    >
                        {this.showCircle ? null : <div className="centered-content">{barContent}</div>}
                    </div>
                );
            }
        });
    }

    render() {
        return (
            this.bars ? (<div className="ageing-bar">
                <div className="legends">{this.legends}</div>
                {this.showCircle && <div className="circles">{this.dots}</div>}
                <div className="bars">{this.bars}</div>
                <div className="counts">{this.counts}</div>
            </div>) : <></>
        );
    }
};
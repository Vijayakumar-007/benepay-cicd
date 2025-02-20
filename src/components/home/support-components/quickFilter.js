import { QuickFilters } from "config/constants";
import moment from "moment";
import React, { useEffect, useState } from "react";

const FilterComponent = ({ data,
    handleApplyClickPaymentSettlement,
    receiptStartDate,
    selectedStatuses,
    receiptEndDate,
    paymentStartDate,
    paymentEndDate }) => {

    const [selectedFilter, setSelectedFilter] = useState("");
    const [count, setCount] = useState(0);

    const handleFilterClick = (filter) => {
        setCount(0);
        setSelectedFilter(filter);
        handleApplyClickPaymentSettlement(filter);
    };

    useEffect(() => {

        let allStatus = ["AWAITING_PAYMENT", "PARTIALLY_PAID", "PAID", "REFUNDED", "CANCELLED", "EXPIRED", "IN_PROCESS", "FAILED"];

        const currentDate = new Date();
        const dateBefore7Days = new Date();
        dateBefore7Days.setDate(currentDate.getDate() - 7);

        if (receiptStartDate && receiptStartDate == moment(dateBefore7Days).format("YYYY-MM-DD") && receiptEndDate && receiptEndDate == moment(currentDate).format("YYYY-MM-DD")) {
            // check for unpaid and all case
            if (selectedStatuses.length == allStatus.length) {
                setSelectedFilter(QuickFilters.ALL);
                return;
            }

            if (selectedStatuses.length == 1 && selectedStatuses.includes("AWAITING_PAYMENT")) {
                setSelectedFilter(QuickFilters.UNPAID);
                return;
            }
        }

        if (paymentStartDate && paymentStartDate == moment(dateBefore7Days).format("YYYY-MM-DD") && paymentEndDate && paymentEndDate == moment(currentDate).format("YYYY-MM-DD")) {
            //check for paid case
            if (selectedStatuses.length == 2 && selectedStatuses.includes("PARTIALLY_PAID") && selectedStatuses.includes("PAID")) {
                setSelectedFilter(QuickFilters.PAID);
                return;
            }
        }
        setSelectedFilter("");
    }, [receiptStartDate, JSON.stringify(selectedStatuses), receiptEndDate, paymentStartDate, paymentEndDate])

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Quick Filters</h2>
                <span style={styles.subtitle}>Last 7 days</span>
            </div>
            <div style={styles.filters}>
                {data.map((filter) => (
                    <button
                        key={filter.name}
                        style={{
                            ...styles.filterButton,
                            ...(selectedFilter === filter.name ? styles.activeButton : {}),
                        }}
                        onClick={() => handleFilterClick(filter.name)}
                    >
                        {filter.name} {filter.count && filter.count != 0 ? filter.count : ""}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        display: 'flex',
        alignItems: 'center'
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
        margin: 0,
        marginRight: '7px'
    },
    subtitle: {
        fontSize: "14px",
        color: "#888",
        marginTop: '4px'
    },
    filters: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginLeft: "12px"
    },
    filterButton: {
        padding: "8px 16px",
        fontSize: "14px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        background: "#fff",
        cursor: "pointer",
        transition: "all 0.3s",
    },
    activeButton: {
        border: "1px solid #ddd",
        background: "var(--primary-color)",
        color: "#fff",
    },
};

export default FilterComponent;
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataSnapshotService } from 'service/api/data-snapshot.service';
import { DataGrid } from '@mui/x-data-grid';

import "./style.css";

// SnapshotDataTable is a component that displays data in a paginated table format.
// It fetches data from the backend based on the specified table type (requests, payments, refunds)
// and applies filters for pagination and sorting.
export const SnapshotDataTable = (props) => {
  // State to manage the list of items to be displayed in the table.
  const [items, setItems] = useState([]);

  // State to manage the current page number for pagination.
  const [page, setPage] = useState(0);

  // State to manage the number of rows per page.
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State to manage the total count of items available for pagination.
  const [totalCount, setTotalCount] = useState(0);

  // State to manage the loading status while fetching data.
  const [loading, setLoading] = useState(true);

  // State to manage the pagination model, including page size and current page.
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: rowsPerPage,
    page: 0,
  });

  // Fetches items from the backend based on the table type and filters.
  const fetchItems = async () => {
    setLoading(true);

    try {
      let response = [];

      // Fetch transactions if the table type is "requests".
      if (props.table == "requests") {
        response = await DataSnapshotService.getTransactions(page, rowsPerPage, props.filters);
      }

      // Fetch payments if the table type is "payments".
      if (props.table == "payments") {
        response = await DataSnapshotService.getPayments(page, rowsPerPage, props.filters);
      }

      // Fetch refunds if the table type is "refunds".
      if (props.table == "refunds") {
        response = await DataSnapshotService.getRefunds(page, rowsPerPage, props.filters);
      }

      // Fetch traceEntry if the table type is "traceEntry".
      if (props.table == "traceEntry") {
        response = await DataSnapshotService.getTraceEntry(page, rowsPerPage, props.filters);
      }
      
      // Fetch traceEntry if the table type is "settle".
      if (props.table == "settlementsData") {
        response = await DataSnapshotService.getSettlementsData(page, rowsPerPage, props.filters);
      }

      setLoading(false);

      // Update items and total count if the response contains data.
      if (response && response.data) {
        // Set processed rows (format date fields if necessary)
        const formattedRows = response.data.map((row) => {
          const formattedRow = { ...row };

          Object.keys(row).forEach((key) => {
            const rowData = row[key];
          
            // If the rowData is falsy (null, undefined, empty string, etc.), return an empty string
            if (!rowData) {
              formattedRow[key] = '';  // Make sure to explicitly set empty string for falsy values
              return;
            }
          
            // If the rowData is an object, check if it is a date or time column
            if (typeof rowData === 'object') {
              if (isDateOrTimeColumn(key)) {
                formattedRow[key] = formatDate(rowData);  // Format date/time fields
              } else {
                formattedRow[key] = '';  // For non-date object, return empty string
              }
            } 
            // If the rowData is an array, check if it's the relevant array (e.g., `fkPaymentId`)
            else if (Array.isArray(rowData)) {
              if (rowData.length > 0 && rowData[0].fkPaymentId) {
                formattedRow[key] = rowData[0].fkPaymentId;  // Extract payment ID
              } else {
                formattedRow[key] = '';  // Return empty string if not relevant
              }
            } 
            // If the rowData is a primitive value (string, number, etc.), set it directly
            else {
              formattedRow[key] = rowData;
            }
          });
          
          return formattedRow;
        });

        setItems(formattedRows);
        setTotalCount(response.noOfData);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  // useEffect to fetch items when the component mounts.
  useEffect(() => {
    fetchItems();
  }, []);

  // useEffect to refetch items when page, rowsPerPage, or filters change.
  useEffect(() => {
    fetchItems();
  }, [page, rowsPerPage, props.filters]);

  // useEffect to handle changes in page size.
  useEffect(() => {
    handlePageSizeChange(paginationModel);
  }, [paginationModel.pageSize]);

  // Handles page change events and updates the current page state.
  const handlePageChange = (params) => {
    setPage(params.page);
  };

  // Handles page size change events and updates the rows per page state.
  const handlePageSizeChange = (params) => {
    setRowsPerPage(params.pageSize);
    setPage(0); // Reset to the first page when the page size changes
  };

  // Generates column definitions based on the keys of the first item in the list.
  const getColumns = () => {
    if (items.length > 0) {
      return Object.keys(items[0]).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
      }));
    }
    return [];
  };

  // Check if a column name is related to date or time
  const isDateOrTimeColumn = (columnName) => {
    const dateKeywords = ['date', 'time', 'created', 'updated', 'timestamp'];
    return dateKeywords.some((keyword) => columnName.toLowerCase().includes(keyword));
  };

  // Utility function to format date fields
  const formatDate = (date) => {
    if (date && date.year) {
      // Ensure all time components have two digits
      const month = String(date.monthValue).padStart(2, '0');
      const day = String(date.dayOfMonth).padStart(2, '0');
      const hour = String(date.hour).padStart(2, '0');
      const minute = String(date.minute).padStart(2, '0');
      const second = String(date.second).padStart(2, '0'); // Pad seconds if needed
  
      // Construct a valid ISO date string
      const formattedDate = `${date.year}-${month}-${day}T${hour}:${minute}:${second}`;
  
      // Try parsing the date and check if it's valid
      const pDate = new Date(formattedDate);
  
      if (isNaN(pDate)) {
        return ''; // Return empty string if the date is invalid
      }
  
      // Return the formatted date string
      return `${String(pDate.getDate()).padStart(2, '0')}-${String(pDate.getMonth()+1).padStart(2, '0')}-${pDate.getFullYear()} ${String(pDate.getHours()).padStart(2, '0')}:${String(pDate.getMinutes()).padStart(2, '0')}:${String(pDate.getSeconds()).padStart(2, '0')}`; // Adjust format as needed
    }
  
    return ''; // Return empty string if not a valid date
  };  

  return (
    <Box sx={{ marginTop: 4 }} className="requestDump">
      {/* DataGrid with Loading spinner */}
      <DataGrid
        className="GridPagination snapshotDataTable"
        loading={loading}
        columns={getColumns()}
        rows={items}
        rowCount={totalCount}
        getRowId={(row) => row[props.rowkey]}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        sortingMode="server"
        paginationMode="server"
        onPaginationModelChange={(newPaginationModel) => {
          setPaginationModel(newPaginationModel);
          handlePageChange(newPaginationModel);
        }}
        onPageSizeChange={(newPaginationModel) => {
          handlePageSizeChange(newPaginationModel);
        }}
      // onSortModelChange={(newSortModel) => {
      //   alert("Under development..");
      // }}
      />
    </Box>
  );
};
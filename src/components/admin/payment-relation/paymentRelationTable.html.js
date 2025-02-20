/**
 * @author Anurag Pundir
 *
 */

import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Pagination } from "config/constants";

export function paymentRelationTable({ result, columns }) {
    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: '100%', marginTop: '3%', textAlign: 'center' }}>
            <DataGrid
                disableColumnSelector
                disableColumnMenu
                disableSelectionOnClick
                disableColumnFilter
                rows={result}
                columns={columns}                                
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: Pagination.transactionPageSize,
                        },
                    },
                }}
            />
        </div>
    );
}

export default paymentRelationTable;

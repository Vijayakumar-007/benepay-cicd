import React, { useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import RolesActionBtn from './roles-action';
import { BenepayUserService } from 'service/api/benepay-user.service';
import { toast } from 'react-toastify';

const RolesList = (props) => {

    let [rolesList, setRolesList] = useState([]);
    const [reRender, setRerender] = useState(1);

    let [tableContent, setTableContent] = useState([
        {
            field: "id",
            headerName: "Id",
            headerClassName: "tableHeaderStyle",
            cellClassName: "table-cell-classname",
            flex: 1,
            maxWidth: 80,
        },
        {
            field: "name",
            headerName: "Name",
            headerClassName: "tableHeaderStyle",
            cellClassName: "table-cell-classname",
            flex: 1,
            minWidth: 140,
            maxWidth: 200,
        },
        {
            field: "description",
            headerName: "Description",
            minWidth: 140,
            headerClassName: "tableHeaderStyle",
            cellClassName: "table-cell-classname",
            flex: 1,
        },
        {
            headerName: "Action",
            width: 140,
            align: "left",
            headerAlign: "left",
            headerClassName: "tableHeaderStyle",
            cellClassName: "table-cell-classname-actions",
            flex: 1,
            minWidth: 140,
            maxWidth: 140,
            disableColumnMenu: true,
            sortable: false,
            border: 0,
            renderCell: (params) => {
                return (
                    <RolesActionBtn
                        params={params}
                        edit={(id) => { 
                            if(props && props.setSelectedEditRole){
                                props.setSelectedEditRole(id);
                                props.setEditScreen();
                            }else{
                                props.setSelectedEditRole(null);
                            }
                        }}
                        delete={deleteRole}
                        clone={cloneRole}
                    />
                );
            },
        },
    ]);

    useEffect(() => {
        if (props && props.rolesList) {
            setRolesList(props.rolesList);
            setRerender(reRender + 1);
        }
    }, [props.rolesList])

    let deleteRole = async (id) => {
        props.setLoading(true);
        let result = await BenepayUserService.deleteRole(id);
        props.setLoading(false);
        if(result){
            toast.success(`Role Succesfully Deleted.`);
            props.getAllRoles();
        }else{
            toast.error(`Unable to delete role.`);
        }
    }

    let cloneRole = (id) => {
        if(props && props.setSelectedEditRole){
            props.setSelectedEditRole(id);
            props.setCloneScreen();
        }else{
            props.setSelectedEditRole(null);
        }
    }

    return (
        <>{reRender && <>
            <DataGrid
                rows={rolesList}
                columns={tableContent}
                className="serachedPaymentResultGridPagination"
                getRowId={(row) => row.id} // Use a field that uniquely identifies each row
                disableColumnSelector={true}
                disableRowSelectionOnClick
                disableColumnFilter
                rowsPerPage={10}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                sx={{
                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#1976d233",
                        cursor: "pointer",
                    },
                }}
            />
        </>}</>
    )
}

export default RolesList;
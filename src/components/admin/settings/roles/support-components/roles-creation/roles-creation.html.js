import React from 'react'
import { Grid, Typography, Checkbox, Select, OutlinedInput, MenuItem, ListItemText, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import "../../roles.scss"
import {
    ButtonPrimary,
    ButtonSecondary,
} from "../../../../../$widgets/buttons/form-button";

const RolesCreationHTML = ({
    setScreenType,
    mainScreenType,
    selectedPrivileges,
    setRoleName,
    roleName,
    description,
    setDescription,
    groupedPrivileges,
    setSelectedPrivileges,
    setGroupedCheckedArray,
    setRerender,
    reRender,
    selectedCombinationRoles,
    setSelectedCombinationRoles,
    getPrivilegeName,
    rolesList,
    createRole,
    setToDefault,
    groupedCheckedArray
}) => {

    return (
        <div className={"home-main position-relative"}>
            <section>
                <ul
                    className="nav nav-pills"
                    id="pills-tab"
                    role="tablist"
                    style={{
                        borderBottom: "1px solid #B4D3FA",
                        position: "relative",
                        marginTop: "8px",
                    }}
                >
                    <li
                        onClick={() => {
                            setScreenType("simple");
                        }}
                        style={{
                            fontSize: "var(--font-large)",
                            fontWeight: "var(--font-weight-normal)",
                            color: "var(--secondary-color)",
                        }}
                    >
                        <a
                            className="navItem active"
                            style={{
                                display: "block",
                                minWidth: "120px",
                                paddingBottom: "8px",
                                marginRight: "2rem",
                                cursor: "pointer",
                            }}
                            id="pills-simple-tab"
                            data-toggle="pill"
                            href="#pills-simple"
                            role="tab"
                            aria-controls="pills-simple"
                            aria-selected="true"
                        >
                            {mainScreenType == "roles-edit" ? "Update Role" : "Simple Creation"}
                        </a>
                    </li>

                    {false && mainScreenType != "roles-edit" && mainScreenType != "roles-clone" &&
                        <li
                            onClick={() => {
                                setScreenType("combination");
                            }}
                            style={{
                                fontSize: "var(--font-large)",
                                fontWeight: "var(--font-weight-normal)",
                                color: "var(--secondary-color)",
                            }}
                        >
                            <a
                                className="navItem"
                                style={{
                                    display: "block",
                                    minWidth: "120px",
                                    paddingBottom: "8px",
                                    marginRight: "2rem",
                                    cursor: "pointer",
                                }}
                                id="pills-combination-tab"
                                data-toggle="pill"
                                href="#pills-combination"
                                role="tab"
                                aria-controls="pills-combination"
                                aria-selected="false"
                            >
                                Combination Creation
                            </a>
                        </li>
                    }
                </ul>
                <div className="tab-content" id="pills-tabContent" style={{ marginTop: '12px' }}>
                    <Grid container mt={1} spacing={1} xs={12} md={12} xl={12}>
                        <Grid item xs={4}>
                            <label
                                htmlFor="name"
                                className="py-1"
                                style={{
                                    whiteSpace: "nowrap",
                                    fontWeight: "var(--font-weight-normal)",
                                    fontSize: "var(--font-x-medium)",
                                    overflow: "hidden",
                                    color: 'var(--dark-color)',
                                    textOverflow: "ellipsis",
                                }}
                            >
                                Name <span style={{ color: 'red', marginBottom: '10px' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={roleName}
                                onChange={(e) =>
                                    setRoleName(e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <label
                                htmlFor="description"
                                className="py-1"
                                style={{
                                    whiteSpace: "nowrap",
                                    fontWeight: "var(--font-weight-normal)",
                                    fontSize: "var(--font-x-medium)",
                                    overflow: "hidden",
                                    color: 'var(--dark-color)',
                                    textOverflow: "ellipsis",
                                }}
                            >
                                Description
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />
                        </Grid>
                    </Grid>
                    <div className="tab-content" id="pills-tabContent" style={{ marginTop: '12px' }}>
                        <div
                            className="tab-pane fade show active"
                            id="pills-simple"
                            role="tabpanel"
                            aria-labelledby="pills-simple-tab"
                            style={{ width: "100%", paddingTop: "12px" }}
                        >
                            <p style={{ fontWeight: 500, color: "#264d00", fontSize: "15px", position: 'relative', bottom: '4px' }}>Privileges <span style={{ color: 'red', marginBottom: '10px' }}>*</span></p>
                            {groupedPrivileges && groupedPrivileges.map((data, index) => {
                                return <>
                                    {data && data.group && data.list && data.list.length > 0 && <>
                                        <Grid container mt={1} spacing={1} xs={12} md={12} xl={12} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: "12px" }}>
                                            <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                                {true && <Checkbox style={{color: 'var(--secondary-color)'}} id={data.group} checked={groupedCheckedArray[index] == 1} onClick={() => {
                                                    let temp = selectedPrivileges;
                                                    let dataListArr = [];
                                                    let num = 0;
                                                    data.list.map((da) => {
                                                        if (!selectedPrivileges.includes(da.id)) {
                                                            temp.push(da.id);
                                                            num++;
                                                        }
                                                        dataListArr.push(da.id);
                                                    })
                                                    
                                                    let t2 = groupedCheckedArray;
                                                    if (num == 0) {
                                                        setSelectedPrivileges(temp.filter(item => !dataListArr.includes(item)));
                                                        t2[index] = 0;
                                                    }else{
                                                        setSelectedPrivileges(temp);
                                                        t2[index] = 1;
                                                    }
                                                    setGroupedCheckedArray(t2);
                                                    setRerender(reRender + 1);
                                                }} />}
                                                <label
                                                    htmlFor={data.group}
                                                    style={{
                                                        fontWeight: "var(--font-weight-normal)",
                                                        fontSize: "var(--font-x-medium)",
                                                        overflow: "hidden",
                                                        color: 'var(--dark-color)',
                                                        textOverflow: "ellipsis",
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginTop: '10px'
                                                    }}
                                                >
                                                    {data.group} 
                                                    {/* <span style={{ marginLeft: '8px', marginTop: '4px', fontSize: '11px', fontWeight: '600', color: 'blue', cursor: 'pointer' }} onClick={() => {
                                                        let temp = selectedPrivileges;
                                                        let dataListArr = [];
                                                        let num = 0;
                                                        data.list.map((da) => {
                                                            if (!selectedPrivileges.includes(da.id)) {
                                                                temp.push(da.id);
                                                                num++;
                                                            }
                                                            dataListArr.push(da.id);
                                                        })
                                                        setSelectedPrivileges(temp);
                                                        if (num == 0) {
                                                            setSelectedPrivileges(temp.filter(item => !dataListArr.includes(item)));
                                                        }
                                                        setRerender(reRender + 1);
                                                    }}>Toggle All</span> */}
                                                </label>
                                            </Grid>
                                            <Grid container xs={9} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {reRender && data.list.map((groupData) => {
                                                    return <>
                                                        <Grid style={{ display: 'flex', alignItems: 'center', marginRight: "12px" }}>
                                                            <Checkbox id={groupData.id} checked={selectedPrivileges.includes(groupData.id)} onClick={() => {
                                                                let temp = selectedPrivileges;
                                                                if (temp.includes(groupData.id)) {
                                                                    setSelectedPrivileges(temp.filter(item => item != groupData.id));
                                                                } else {
                                                                    temp.push(groupData.id);
                                                                    setSelectedPrivileges(temp);
                                                                }
                                                                setRerender(reRender + 1);
                                                            }} style={{color: 'var(--secondary-color)'}} />
                                                            <label style={{ display: 'block', margin: '0 auto', marginRight: '8px', cursor: 'pointer' }} htmlFor={groupData.id} >{groupData.name}</label>
                                                            <Tooltip
                                                                title={
                                                                    <div style={{ width: '250px', paddingTop: '12px' }}>
                                                                        <Typography color="inherit">{groupData.type == "2" ? "Functional Privilege" : "Screen Privilege"}</Typography>
                                                                        <p style={{ marginTop: '2px' }}>{groupData.description}</p>
                                                                    </div>
                                                                }
                                                                placement="top"
                                                                sx={{ background: 'white', color: "black" }}
                                                            >
                                                                <FontAwesomeIcon icon={faInfo} color={'var(--secondary-color)'} style={{ height: 'var(--font-medium)', width: "6px", cursor: 'pointer' }} />
                                                            </Tooltip>

                                                        </Grid>
                                                    </>
                                                })}
                                            </Grid>
                                        </Grid>
                                    </>}
                                </>
                            })}
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-combination"
                            role="tabpanel"
                            aria-labelledby="pills-combination-tab"
                            style={{ width: "100%" }}
                        >
                            <Grid container mt={1} spacing={1} xs={12} md={12} xl={12}>
                                <Grid item xs={4} style={{ position: 'relative' }}>
                                    <label
                                        htmlFor="name"
                                        className="py-1"
                                        style={{
                                            whiteSpace: "nowrap",
                                            fontWeight: "var(--font-weight-normal)",
                                            fontSize: "var(--font-x-medium)",
                                            overflow: "hidden",
                                            color: 'var(--dark-color)',
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        Roles <span style={{ color: 'red', marginBottom: '10px' }}>*</span>
                                    </label>
                                    <Select
                                        labelId="multiple-name-label"
                                        id="multiple-name"
                                        className="form-control multi-select"
                                        multiple
                                        value={selectedCombinationRoles}
                                        onChange={(e) => setSelectedCombinationRoles(e.target.value)}
                                        input={<OutlinedInput style={{ position: 'relative' }} label="Roles" />}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: '224px',
                                                    width: 400,
                                                    top: '0px !important'
                                                },
                                            },
                                        }}
                                        renderValue={(selected) => getPrivilegeName(selected).join(", ")}
                                    >
                                        {rolesList.map((privilege) => (
                                            <MenuItem
                                                key={privilege.id}
                                                value={privilege.id}
                                            >
                                                <Checkbox checked={selectedCombinationRoles.includes(privilege.id)} />
                                                <ListItemText primary={privilege.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div className="d-flex justify-content-start mt-5">
                        <span style={{ marginRight: "60px" }}>
                            <ButtonPrimary
                                onClick={createRole}
                                style={{ marginLeft: "5px", padding: "1%" }}
                            >
                                {mainScreenType == "roles-edit" ? "Update" : "Create"}
                            </ButtonPrimary>
                            <ButtonSecondary
                                onClick={setToDefault}
                                style={{ marginLeft: "5px", padding: "1%" }}
                            >
                                Cancel
                            </ButtonSecondary>
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RolesCreationHTML;
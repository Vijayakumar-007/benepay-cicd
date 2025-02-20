import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Tab, Box } from '@material-ui/core';

//Roles screen
import Roles from 'components/admin/settings/roles/roles';

//Parameters screen
import Parameter from './parameters';

//Service
import PermissionGuard from 'components/$widgets/permission/permissionGuard';
import { TempStorage } from 'service/core/storage.service';

//Constants
import { PrivilegeConstants } from 'config/constants';

const rolesScreen = PrivilegeConstants.ROLES_SCEEN;
const parameterConfig = PrivilegeConstants.PARAMETERS_CONFIGURATION;

const Settings = () => {
    const [value, setValue] = useState(0);
    const [privileges, setPrivilege] = useState([]);

    useEffect(() => {
        setPrivilege(TempStorage.userPrivilege);

        if (privileges[rolesScreen] && privileges[parameterConfig]) {
            setValue(0);
        }
        if(privileges[parameterConfig]){
            setValue(1);
        }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    return (
        <>
            <Tabs
                value={value}
                TabIndicatorProps={{ style: { background: 'var(--primary-color)' } }}
                onChange={(e, newValue) => handleChange(e, newValue)}
                style={{ color: 'var(--primary-color)' }}
            >
                {privileges && privileges[rolesScreen] ?
                    <Tab label="Roles" style={{ textTransform: 'none' }} />
                    : ""
                }

                {privileges && privileges[parameterConfig] ?
                    <Tab label="Provider Configuration" style={{ textTransform: 'none' }} />
                    : ""
                }

            </Tabs>

            <div>
                <hr className='divider' style={{ border: '0.5px solid #00000014', width: '100%', margin: 'unset' }} />
            </div>

            <div className='mt-4'>
                <PermissionGuard userPermission={PrivilegeConstants.ROLES_SCEEN}>
                    <TabPanel value={value} index={0}>
                        <Roles />
                    </TabPanel>
                </PermissionGuard>

                <PermissionGuard userPermission={PrivilegeConstants.PARAMETERS_CONFIGURATION}>
                    <TabPanel value={value} index={1}>
                        <Parameter />
                    </TabPanel>
                </PermissionGuard>
            </div>
        </>
    );
}

export default Settings;

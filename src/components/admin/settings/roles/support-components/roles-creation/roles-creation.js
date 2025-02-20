import React, { useEffect, useState } from 'react'
import "../../roles.scss"
import { BenepayUserService } from 'service/api/benepay-user.service';
import { toast } from 'react-toastify';
import RolesCreationHTML from './roles-creation.html';

const RolesCreation = (props) => {

    const [screenType, setScreenType] = useState("simple")
    const [mainScreenType, setMainScreenType] = useState("roles-creation");
    const [roleName, setRoleName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPrivileges, setSelectedPrivileges] = useState([]);
    const [selectedCombinationRoles, setSelectedCombinationRoles] = useState([]);
    const [allPrivileges, setAllPrivileges] = useState([]);
    const [groupedPrivileges, setGroupedPrivileges] = useState([]);
    const [groupedCheckedArray, setGroupedCheckedArray] = useState([]);
    const [rolesList, setRolesList] = useState([]);

    const [reRender, setRerender] = useState(1);

    useEffect(() => {
        getAllPrivileges();
    }, [])

    useEffect(() => {
        if (props && props.rolesList) {
            setRolesList(props.rolesList);
        }

        if (props && props.screenType) {
            setMainScreenType(props.screenType);
        }

        if (props && props.selectedEditRole) {
            getPrivilegesById(props.selectedEditRole);
            if ( props && props.screenType == "roles-edit" ) {
                props.rolesList.map(element => {
                    if (element.id == props.selectedEditRole) {
                        setRoleName(element.name);
                        setDescription(element.description);
                        return;
                    }
                });
            }
        }
    }, [props.rolesList, props.selectedEditRole, props.screenType])

    useEffect(() => {
        updateGroupedCheckedArray(groupedPrivileges, selectedPrivileges);
    }, [groupedPrivileges.toLocaleString(), selectedPrivileges.toLocaleString()])

    const getAllPrivileges = async () => {
        props.setLoading(true);
        let result = await BenepayUserService.getAllPrivileges();
        props.setLoading(false);
        if (result) {
            setAllPrivileges(result);

            const groupedArray = result.reduce((acc, item) => {
                // Find the group object for the current item
                let group = acc.find(g => g.group === item.groupName);

                // If the group doesn't exist, create it
                if (!group) {
                    group = { group: item.groupName, list: [] };
                    acc.push(group);
                }

                // Add the current item to the group's list
                group.list.push(item);

                return acc;
            }, []);

            setGroupedPrivileges(groupedArray);
            setRerender(reRender + 1);

        }
    }

    const updateGroupedCheckedArray = (groupedArray, array) => {
        let newArr = groupedArray.map((e) => {
            let allP = true;
            e.list.map(ele => {
                if(!array.includes(ele.id)){
                    allP = false;
                }
            });
            return allP ? 1 : 0;
        });
        
        setGroupedCheckedArray(newArr);
    }

    const setToDefault = () => {
        setRoleName("");
        setDescription("");
        setSelectedPrivileges([]);
        setSelectedCombinationRoles([]);
        if (props && props.setScreenType) {
            props.setScreenType("roles-list")
        }
    }

    const createRole = async () => {

        if (roleName.length == 0) {
            toast.error(`Role Name Must be present`);
            return;
        }

        if (screenType == "simple" && selectedPrivileges.length < 1) {
            toast.error(`At least one privilege is required to create role`);
            return;
        }

        if (screenType == "combination" && selectedCombinationRoles.length < 2) {
            toast.error(`At least select combination on two roles to create new role`);
            return;
        }

        let request = {
            roleId: mainScreenType == "roles-edit" && props && props.selectedEditRole ? props.selectedEditRole : null,
            roleName: roleName,
            roleDescription: description,
            selectedPrivileges: screenType == "simple" ? selectedPrivileges : null,
            selectedCombinationRoles: screenType == "combination" ? selectedCombinationRoles : null
        };

        props.setLoading(true);
        let result = await BenepayUserService.createRole(request);
        props.setLoading(false);
        if (result) {
            setToDefault();
            props.getAllRoles();
            toast.success(mainScreenType == "roles-edit" ? `${result.name} Role Succesfully Updated.` : `${result.name} Role Succesfully Created.`);
        }
    }

    let getPrivilegeName = (selected) => {
        let arr = [];
        selected.forEach(element => {
            arr.push(getPrivilegeNameById(element));
        });
        return arr;
    }

    let getPrivilegeNameById = (id) => {
        let el = "";
        rolesList.forEach(element => {
            if (element.id == id) {
                el = element.name;
            }

        });

        return el;
    }

    let getPrivilegesById = async (id) => {
        props.setLoading(true);
        let result = await BenepayUserService.getPrivilegesById(id);
        props.setLoading(false);
        if (result) {
            setSelectedPrivileges(result);
            setRerender(reRender + 1);
        }
    }

    return <RolesCreationHTML 
    setScreenType={setScreenType}
    mainScreenType={mainScreenType}
    selectedPrivileges={selectedPrivileges}
    setRoleName={setRoleName}
    roleName={roleName}
    description={description}
    setDescription={setDescription}
    groupedPrivileges={groupedPrivileges}
    setSelectedPrivileges={setSelectedPrivileges}
    setGroupedCheckedArray={setGroupedCheckedArray}
    setRerender={setRerender}
    reRender={reRender}
    selectedCombinationRoles={selectedCombinationRoles}
    setSelectedCombinationRoles={setSelectedCombinationRoles}
    getPrivilegeName={getPrivilegeName}
    rolesList={rolesList}
    createRole={createRole}
    setToDefault={setToDefault}
    groupedCheckedArray={groupedCheckedArray}
    />
}

export default RolesCreation;
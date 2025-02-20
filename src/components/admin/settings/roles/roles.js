import React, { useEffect, useState } from 'react'
import RolesList from './support-components/roles-list';
import { Grid } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import RolesCreation from './support-components/roles-creation/roles-creation';
import "./roles.scss"
import { BenepayUserService } from 'service/api/benepay-user.service';
import Loader from 'components/$widgets/loader';

const Roles = (props) => {

  let [screenType, setScreenType] = useState("roles-list");
  let [allRoles, setAllRoles] = useState([]);
  let [selectedEditRole, setSelectedEditRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRoles();
  }, [])

  let getAllRoles = async () => {
    setLoading(true);
    let result = await BenepayUserService.getAllRoles();
    setLoading(false);
    if(result){
      setAllRoles(result);
    }
  }

  return (
    <>
    <Loader loading={loading} />
    <div>
      {screenType == "roles-list" && <>
        {/* <TitleBar title={"User Roles"} color={"green"} /> */}
        <Grid container spacing={2} xs={12} style={{ alignItems: 'center', justifyContent: 'flex-end', display: 'flex', color: '#6654C3', marginBottom: '12px' }}>
          <button onClick={() => { setScreenType("roles-creation"); }} style={{ border: '0', outline: '0', background: '#00000000', cursor: 'pointer', width: 'fit-content', height: 'fit-content' }}>
            <a style={{ alignItems: 'center', justifyContent: 'flex-start', display: 'flex', padding: '4px 0px', width: "fit-content", borderRadius: "12px", cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faSquarePlus} style={{ color: '#6654C3', marginRight: '8px' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#6654C3' }}>Add New Role</span>
            </a>
          </button>
        </Grid>
        <RolesList setLoading={setLoading} getAllRoles={getAllRoles} rolesList={allRoles} setEditScreen={() => {setScreenType("roles-edit")}} setCloneScreen={() => {setScreenType("roles-clone")}} setSelectedEditRole={setSelectedEditRole}/>
      </>}
      {screenType == "roles-creation" && <>
        <RolesCreation setLoading={setLoading} getAllRoles={getAllRoles} setScreenType={setScreenType} rolesList={allRoles}/>
      </>}
      {screenType == "roles-edit" && <>
        <RolesCreation setLoading={setLoading} getAllRoles={getAllRoles} setScreenType={setScreenType} rolesList={allRoles} screenType={"roles-edit"} selectedEditRole={selectedEditRole} setSelectedEditRole={setSelectedEditRole}/>
      </>}
      {screenType == "roles-clone" && <>
        <RolesCreation setLoading={setLoading} getAllRoles={getAllRoles} setScreenType={setScreenType} rolesList={allRoles} screenType={"roles-clone"} selectedEditRole={selectedEditRole} setSelectedEditRole={setSelectedEditRole}/>
      </>}
    </div>
    </>
  )
}

export default Roles;
import React, { useEffect, useState } from 'react';
import { TempStorage } from 'service/core/storage.service';

const PermissionGuard = ({ userPermission, children, fallback = null, forcePermission = false }) => {

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    let privileges = TempStorage.userPrivilege;
    if(privileges && privileges[userPermission]){
      setHasPermission(true)
    }else{
      setHasPermission(false);
    }

    if(forcePermission){
      setHasPermission(true);
    }
  })

  return (
    <>
      {hasPermission ? children : fallback}
    </>
  );
};

export default PermissionGuard;

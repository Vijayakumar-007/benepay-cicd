import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faClipboard, faRotateLeft, faCircleXmark, faBell, faEdit, faTrash, faClone } from '@fortawesome/free-solid-svg-icons';


const RolesActionBtn = (props) => {

    return (
        <div className="dropdown" style={{ marginRight: '24px', overflow: 'visible' }}>
            {props && props.params && props.params.row && props.params.row.id != 1 && <>
                <ul style={{ listStyle: 'none', padding: '0', width: '100%', margin: '0', zIndex: '70', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <li key={`edit`} style={{ padding: '8px', width: '100%' }} onClick={() => { props.edit(props.params.row.id); }}>
                        <FontAwesomeIcon icon={faEdit} style={{ color: 'blue', marginRight: '0px', cursor: 'pointer' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}></span>
                    </li>
                    {props.params.row.id != 2 && <>
                        <li key={`delete`} style={{ padding: '8px', width: '100%' }} onClick={() => { props.delete(props.params.row.id); }}>
                            <FontAwesomeIcon icon={faTrash} style={{ color: 'red', marginRight: '0px', cursor: 'pointer' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}></span>
                        </li>
                    </>}
                    <li key={`clone`} style={{ padding: '8px', width: '100%' }} onClick={() => { props.clone(props.params.row.id); }}>
                        <FontAwesomeIcon icon={faClone} style={{ color: 'green', marginRight: '0px', cursor: 'pointer' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}></span>
                    </li>
                </ul>
            </>}
        </div>
    );

};

export default RolesActionBtn;
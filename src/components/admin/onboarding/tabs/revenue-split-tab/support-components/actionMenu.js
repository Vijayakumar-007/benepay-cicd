import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faClipboard, faRotateLeft, faCircleXmark, faBell, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const ActionMenu = (props) => {

    return (
        <div className="dropdown" style={{ marginRight: '24px', overflow: 'visible' }}>
            {/* <button type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ display: 'flex', alignItems: 'center', color: '#1A1A1C', border: 'none', outline: 'none', background: "transparent" }}>
                <FontAwesomeIcon icon={faEllipsisVertical} style={{ fontSize: 'var(--font-medium)' }} />
            </button>
            <div className={"dropdown-menu dropdown-menu-lg-x-end-action-btn-down-aw"} aria-labelledby="dropdownMenuButton" style={{ padding: '4px', height: 'auto', minWidth: '245px', borderRadius: '4px', background: 'var(--light-color)', border: 'none', zIndex: '70' }}> */}
                <ul style={{ listStyle: 'none', padding: '0', width: '100%', margin: '0', zIndex: '70', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <li key={`edit`} style={{ padding: '8px', width: '100%' }} onClick={() => { props.editSplit(props.params.row.merchantSplitId); }}>
                        <FontAwesomeIcon icon={faEdit} style={{ color: 'blue', marginRight: '8px', cursor: 'pointer' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}></span>
                    </li>
                    <li key={`delete`} style={{ padding: '8px', width: '100%' }} onClick={() => { props.deleteSplit(props.params.row.merchantSplitId); }}>
                        <FontAwesomeIcon icon={faTrash} style={{ color: 'red', marginRight: '0px', cursor: 'pointer' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}></span>
                    </li>
                </ul>
            {/* </div> */}
        </div>
    );

};

export default ActionMenu;
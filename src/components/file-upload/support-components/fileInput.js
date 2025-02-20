import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudArrowUp
} from "@fortawesome/free-solid-svg-icons";

import './fileInput.css';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        props.onDropFile(e);
        e.target.value = "";
    }

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label" style={{color: "#0A365F"}}>
                    <FontAwesomeIcon icon={faCloudArrowUp} style={{ fontSize: "var(--icons-upload-icon)", marginBottom: '10px', color: "var(--prime-color)" }}/>
                    <p style={{ fontSize: "var(--font-small)", marginBottom: '4px', color: 'var(--prime-color)' }}>Drag & Drop your file here</p>
                    <p style={{ fontSize: "var(--font-small)", color: 'var(--prime-color)' }}>
                        *File should be in CSV or XLSX format and File size should be under 200KB.
                    </p>
                </div>
                <input type="file" value="" onChange={onFileDrop}/>
            </div>
            
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './fileInput.scss';

const FancyFileInput = props => {

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
                    {props.icon && <FontAwesomeIcon icon={props.icon} style={{ fontSize: "var(--icons-upload-icon)", marginBottom: '10px', color: "var(--prime-color)" }}/>}

                    {props.children}
                </div>
                <input type="file" value="" onChange={onFileDrop} title='Choose File'/>
            </div>
            
        </>
    );
}

FancyFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default FancyFileInput;
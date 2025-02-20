import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, FormGroup, FormControlLabel, FormControl, Checkbox, Card, Stack, FormHelperText, InputAdornment, CardContent, Button } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSquareFull, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const Upload = ({
    uploadFileList,
    setUploadFileList,
    params,
    toast
}) => {

    const [paymentId, setPaymentId] = useState(params && params.row ? params.row.paymentId : null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [count, setCount] = useState(1);

    useEffect(() => {
        setPaymentId(params && params.row ? params.row.paymentId : null);
        setFileName(params && params.row && params.row.fircFileName ? params.row.fircFileName : null);
        setCount(params.api.getAllRowIds().indexOf(params.id));
    }, []);

    useEffect(() => {
        let newUploadList = uploadFileList;
        if (file || fileName.length > 0) {
            newUploadList[count] = {
                file: file ? file.split(',')[1] : null,
                fileName: fileName,
                paymentId: paymentId
            };
        }
        if (!file && fileName.length == 0) {
            newUploadList[count] = null;
        }
        setUploadFileList(newUploadList);
    }, [file])

    let handleFileChange = async (e) => {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) {
            return
        }
        if (validateFile(files[0])) {
            setFile(await getBase64FromFile(files[0]));
        }
    }

    let validateFile = (file) => {
        const allowedExtensions = ['pdf']
        const extension = file.name
            .substr(file.name.lastIndexOf('.') + 1)
            .toLowerCase()
        if ((file.size / 1024 / 1024) > 0.2) {
            toast.info('Please upload file less then 200 KB.')
            setFile(null);
            return false;
        }
        if (allowedExtensions.indexOf(extension) === -1) {
            toast.info('Invalid file Format. Only ' + allowedExtensions.join(', ') + ' is allowed.');
            setFile(null);
            return false;
        }

        setFileName(file.name);
        return true;
    }

    let getBase64FromFile = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    return (
        <div className='flex-100' style={{ width: '100%' }}>
            <label htmlFor={"fileElem" + params.id} className='flex cursor-pointer overflow-hidden'>
                <i
                    className="fa fa-upload uploadIcon"
                    style={{ fontSize: "18px", marginRight: '10px' }}
                ></i>
                <input
                    type="file"
                    id={"fileElem" + params.id}
                    onChange={(e) => {
                        handleFileChange(e);
                    }}
                    style={{display: "none"}}
                />
                <b className='truncate'>{fileName ? fileName : "Choose File"}</b>
            </label>

            <ul style={{ listStyle: 'none', padding: '0', margin: '0', marginRight: "20px", zIndex: '70', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <li key={`delete`} style={{ padding: '8px', width: '100%' }} onClick={() => {
                    setFile(null); setFileName("");
                    let newUploadList = uploadFileList;
                    newUploadList[count] = {
                        file: null,
                        fileName: null,
                        paymentId: paymentId
                    };
                    setUploadFileList(newUploadList);
                }}>
                    <FontAwesomeIcon icon={faTrash} style={{ color: 'red', marginRight: '0px', cursor: 'pointer' }} /> <span style={{ fontSize: 'var(--font-small)', fontWeight: '500', color: '#495370' }}></span>
                </li>
            </ul>
        </div>
    )
}

export default Upload;
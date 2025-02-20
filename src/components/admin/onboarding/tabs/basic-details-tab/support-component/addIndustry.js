import React, { useState, useEffect, Component } from 'react';
import { Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './addIndustry.scss';
import Loader from "components/$widgets/loader";
import { BenepayUserService } from 'service/api/benepay-user.service';
import { toast } from 'react-toastify';

function AddIndustry({ getMerchantIndustrys, enable, handleOnClose }) {

    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isFocused, setIsFocused] = useState({
        field1: false,
        field2: false,
        field3: false
    });

    const [value, setValue] = useState({
        field1: '',
        field2: '',
        field3: ''
    });

    const handleClose = () => {
        setShow(false);
        handleOnClose();
    };


    useEffect(() => {
        const isEitherEmpty = code.trim() === '' || description.trim() === '';
        setIsValid(!isEitherEmpty);
    }, [code, description]);

    const saveIndustry = async (desc, code) => {
        let request = {
            fklookupId: "3",
            lookupCode: code,
            lookupDescription: desc
        }
        console.log("this is request: ", request);
        setLoading(true);
        const response = await BenepayUserService.addLookupDetails(request);

        if (response && response.status != "Failure") {
            setLoading(false)
            toast.success(`New Industry updated Successfully!`);
            handleOnClose();
            getMerchantIndustrys();
            setShow(false);
        } else {
            setLoading(false)
            response.lookupErrors.forEach(error => {
                toast.error(`${error.errorMsg}`);
            });
        }

    }

    useEffect(() => {
        setShow(enable);
        setShow(true);
        setDescription("");
        setCode("");
        setIsValid(false);
        console.log("this is show: ", show, enable);
    }, []);

    const handleonFocus = (event) => {
        event.target.setAttribute('autocomplete', 'off');

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValue({
            ...value,
            [name]: value
        });
    };


    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (value.trim() === '') {
            setIsFocused((prevState) => ({
                ...prevState,
                [name]: true
            }));
        }else{
            setIsFocused((prevState) => ({
                ...prevState,
                [name]: false
            }));
        }
    };



    const renderError = (field) => {
        return isFocused[field] && !value[field] ? <p className="error-required-msg"> * This is required </p>: null;
    };



    return (
        <>

            <Loader loading={loading} />

            <Modal show={show} onHide={handleClose} centered backdropClassName="custom-backdrop"
                style={{ alignItems: 'center', justifyItems: 'flex-start', flexWrap: 'nowrap', flexDirection: 'column', alignContent: 'center' }}>

                <Modal.Header >
                    <Modal.Title>                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        onSubmit={(e) => {
                            console.log("this is new industry: ", description, code);
                            e.preventDefault();
                            saveIndustry(description, code);
                        }}
                        id="editmodal"
                        className="w-full max-w-sm"
                    >
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label
                                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 required-label" 
                                    htmlFor="description"
                                >
                                    Industry
                                </label>
                            </div>
                            <div className="md:w-2/3"
                            style={{ position: 'relative',
                                marginBottom: '22px'}}
                            >
                                <div className='col'>
                                    <div className='row'>
                                        <input
                                            onFocus={handleonFocus}
                                            onBlur={handleBlur}
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="description"
                                            placeholder='Information Technology'
                                            type="text"
                                            value={description}
                                            name="field1"
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                                handleInputChange;
                                            }}
                                        />
                                    </div>

                                    <div className='row mt-4'>
                                    {renderError('field1')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label
                                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 required-label"
                                    htmlFor="code"
                                >
                                    Code
                                </label>
                            </div>
                            <div className="md:w-2/3"
                             style={{ position: 'relative',
                                marginBottom: '22px'}}
                            >
                                <div className='col'>
                                    <div className='row'>
                                        <input
                                            onFocus={handleonFocus}
                                            onBlur={handleBlur}
                                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="code"
                                            placeholder='IT'
                                            type="text"
                                            value={code}
                                            name="field2"
                                            onChange={(e) => {
                                                setCode(e.target.value);
                                                handleInputChange;
                                            }}
                                        />
                                    </div>
                                    
                                    <div className='row mt-4'>
                                        {renderError('field2')}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={!isValid} type="submit"
                        form="editmodal"  >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddIndustry;

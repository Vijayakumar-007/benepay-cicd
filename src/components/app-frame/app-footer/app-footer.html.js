import React from 'react';
import {Link} from 'react-router-dom'

export function html() {
    return (
        <footer className={`app-footer-main py-3 px-3 ${this.props.className}`} style={{background: 'white'}}>
            <div className="container">
                {/* <div className="row flex-row justify-content-between"> */}
                <div className="d-flex justify-content-center align-items-center">
                    <p style={{color: 'var(--primary-color)', fontSize: 'var(--font-medium)', margin: '0', fontWeight: '500', padding: '4px 0'}}>Copyright © {new Date().getFullYear()} BenePay Ltd. All rights reserved</p>
                    {/*<div className="col-12 col-sm-6 col-md-4"></div>*/}
                    {/*<div className="col-6 col-sm-4 col-lg-1"><Link to="/about-us" target="_blank" className='text-light'>About</Link></div>*/}
                    {/* <div className=""><a href="https://www.benepay.io/#/terms-and-conditions#main" target="_blank">Terms & Conditions</a></div> */}
                    {/* <div className=""><a href="https://www.benepay.io/#/privacy-policy#main" target="_blank">Privacy</a></div> */}
                    {/* <div className=""><a href="https://www.benepay.io/#/cookie-policy#main" target="_blank">Cookies</a></div> */}
                    {/*<div className=""><Link to="/faq" target="_blank">FAQs</Link></div>*/}
                    {/*<div className=""><Link to="/legal" target="_blank">Legal</Link></div>*/}
                    {/* <div className=""><a href="https://www.benepay.io/#/support#contact-us" target="_blank">Contact Us</a></div> */}
                </div>
                </div>
            {/* </div> */}
        </footer>
    );
};

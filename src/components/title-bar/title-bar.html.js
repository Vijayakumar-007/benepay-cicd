import React from 'react';
import TitleBar from "./title-bar";
import SearchIcon from "@material-ui/icons/Search";

export function html() {
    const {title, children, className, bold, ruleColor, color, hideUnderline, showIcon, fontSize} = this.props;
    return (
        <div className={`title-bar-main d-flex flex-column ${className}`}>
            <div className="row">
                <div className={` fullWidth ${this.props.infoIcon == 'show' ? 'col-10' : 'col-12'} `}>
                    <p style={{fontWeight:0,color:"#264d73",fontSize: fontSize ? fontSize :"15px", position: 'relative', bottom: '4px'}} className={`mb-0
                                ${bold ? 'font-weight-bold' : ''}
                                ${color === TitleBar.Color.blue ? 'blue-heading' : color === TitleBar.Color.orange ? 'text-orange' : ''}`}>{title}</p>
                </div>
                {
                    this.props.infoIcon == 'show' && <div className="col-2 infoIcon">
                        <i class="fa fa-info-circle" style={{color : '#007bff', fontSize : '15px'}}></i>
                    </div>
                }
            </div>
            
            { showIcon && <SearchIcon/> }
            {!hideUnderline &&
                <hr className={`my-2 ${ruleColor === TitleBar.Color.blue ? 'blue-ruler' : TitleBar.Color.black ? 'bg-dark' : 'gray-ruler'}`}/>}
            {children}
        </div>
    )
}
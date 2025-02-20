import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from "@material-ui/core";
import "../../../assets/css/colors.scss";
import {colors} from "../../../assets/js/colors";
import CancelIcon from '@material-ui/icons/Cancel';

const defaultStyles = {
    root: {
        background: 'var(--primary-color)',
        color: 'var(--light-color)',
        '&:hover': {
            background: 'var(--primary-color)',
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
        },
        border: 'none',
        textTransform: 'capitalize',
        padding: '6px 20px',
        outline: 'none',
        height: 35,
        minWidth: 160,
    },
    disabled: {
        color: '#424242 !important',
        background: '#79a5d1',
        border: 'none'
    },
    label: {
        fontSize: '14px',
        fontWeight: '400',
        fontFamily: 'Helvetica',
    }
};

const ButtonPrimary = withStyles({
    ...defaultStyles
})(Button);

const ButtonPrimarySm = withStyles({
    ...defaultStyles,
    root: {
        padding: '6px 10px',
        
        background:'#264d73'
    },
    label: {
        fontSize: '16px'
    }
})(ButtonPrimary);

const ButtonSecondary = withStyles({
    ...defaultStyles,
    root: {
        ...defaultStyles.root,
        background: 'var(--secondary-color)',
        color: 'var(--light-color)',
        textTransform: 'capitalize',
        outline: 'none',
        '&:hover': {
            background: 'var(--secondary-color)',
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
        }
    }
})(Button);

const ButtonSecondarySm = withStyles({
    label: {
        fontSize: '16px'
    }
})(ButtonSecondary);

const ButtonOutlined = withStyles({
    ...defaultStyles,
    root: {
        ...defaultStyles.root,
        background: colors["$color-blue"],
        color: '#fff',
        textTransform: 'capitalize',
        outline: 'none',
        border: '1px solid #006BBD',
        padding: '6px 20px',
        '&:hover': {
            backgroundColor: '#006BBD',
            color: '#fff',
        }
    }
})(ButtonPrimary);

const ButtonWithIcon = withStyles({
        ...defaultStyles,
        root: {
            ...defaultStyles.root,
            background: 'transparent',
            color: "#fff",
            textTransform: 'capitalize',
            outline: 'none',
            border: 'none',
            padding: '6px 20px',
            '&:hover': {
                backgroundColor: '#006BBD',
                color: '#fff',
            }
        }
    }
)((props) => {
    return <Button {...props}><span className={'mr-1'}>{props.children}</span> <CancelIcon
        style={{fontSize: '30'}}/></Button>
});


export {
    ButtonPrimary,
    ButtonSecondary,
    ButtonOutlined,
    ButtonWithIcon,
    ButtonPrimarySm,
    ButtonSecondarySm
};
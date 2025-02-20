import {makeStyles} from "@material-ui/core";

const colorPrimary = '#0e78fa';
const colorSecondary = '#C13229';

export const styles = makeStyles(theme => ({
    noFocus: {
        '&:focus': {
            backgroundColor: 'transparent',
        }
    },
}));

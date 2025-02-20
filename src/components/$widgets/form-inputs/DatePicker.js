import { FormControl } from "@mui/material";
import { makeStyles } from '@material-ui/core';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const useStyles = makeStyles({
    root: {
        "& .MuiInputBase-root": {
            // padding: 0,
            // "& .MuiButtonBase-root": {
            //     padding: 0,
            //     paddingLeft: 10
            // },
            "& .MuiInputBase-input": {
                padding: 9,
            },
        }
    }
});

export default function MDDatePicker(props) {
    const classes = useStyles();

    return (
        <>
            <FormControl variant={props.variant} fullWidth style={{ width: props.width }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        onChange={props.onChange}
                        format={props.format}
                        slotProps={{ textField: { placeholder: props.placeholder } }}
                        className={classes.root}
                        value={props.value}
                    />
                </LocalizationProvider>
            </FormControl>
        </>
    );
}
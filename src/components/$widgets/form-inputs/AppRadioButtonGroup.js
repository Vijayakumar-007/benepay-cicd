import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

export function AppRadioButtonsGroup({label, options, selected}) {
    const [value, setValue] = React.useState(selected);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <FormControl component="fieldset">
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <RadioGroup className='flex-row'
                        aria-label="gender"
                        name="gender1"
                        value={value} onChange={handleChange}>
                {
                    options.map(option => (
                        <FormControlLabel
                            className={'mb-0'}
                            key={option.value}
                            value={option.value}
                            control={<Radio/>}
                            label={option.text}/>)
                    )
                }
            </RadioGroup>
        </FormControl>
    );
}

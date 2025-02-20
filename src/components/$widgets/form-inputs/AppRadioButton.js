import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';

const StyledRadio = withStyles({
  root: {
    '&$checked': {
      color: 'var(--primary-color)',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export default function AppRadioButton(props) {
  return (
    <div>
      <StyledRadio
        checked={props.value}
        value={props.value}
        name="radio-button"
        inputProps={{ 'aria-label': props.lable }}
        disabled={props.disabled ? props.disabled : false}
      />
    </div>
  );
}

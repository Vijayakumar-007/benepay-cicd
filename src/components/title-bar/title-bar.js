import React from 'react';
import {html} from "./title-bar.html";
import * as PropTypes from "prop-types";
import {colors} from "../../assets/js/colors";
import { propTypes } from 'react-bootstrap/esm/Image';

class TitleBar extends React.Component  {

    static Color = {
        blue: '#264d73',
        orange: 'orange',
        black: 'black'
    };

    constructor(props) {
        super(props);

        this.state = {}
    }

    render= () => html.apply(this);
}

export default TitleBar;

TitleBar.propTypes = {
    title: PropTypes.string,
    bold: PropTypes.bool,
    ruleColor: PropTypes.string,
    color: PropTypes.string,
    hideUnderline: PropTypes.bool,
    fontSize : propTypes.string
};
import React, {Component} from 'react';
import './copy-me.scss';
import {withStyles} from "@material-ui/core";
import {styles} from "./copy-me.styles";
import clsx from "clsx";
import {html} from "./copy-me.html";

class CopyMe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        }
    }

    render = () => html.apply(this);
}

export default (CopyMe);

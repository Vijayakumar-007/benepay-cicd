import React, {Component} from 'react';
import './app-footer.scss';
import {html} from "./app-footer.html";

class AppFooter extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render = () => html.apply(this);
}

export default AppFooter;

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root/root';
import Amplify from "aws-amplify";
import 'typeface-roboto'
import { config } from './config/config';
import { Environment } from '../src/enum/common.enum';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: process.env.REACT_APP_AWS_CONFIG_REGION,
        userPoolId: process.env.REACT_APP_AWS_CONFIG_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_AWS_CONFIG_USER_POOL_WEB_CLIENT_ID,
    },
});

ReactDOM.render(
    <Root/>,
    document.getElementById('root')
);

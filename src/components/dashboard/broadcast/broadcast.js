import { Component } from "react";
import { html } from "./broadcast.html";
import { DashboardService } from "../../../service/api/dashboard.service";
import { Auth } from "aws-amplify";
import { StorageKeys, StorageService } from "../../../service/core/storage.service";


/**
 * @author Ragavan
 * 
 * Class created to handle the Broadcast
 */
export default class Broadcast extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Heading: 'Dashboard',
            loading:false,
            broadcastMessages: [],
            expanded : {},
            modalOpen: false,
        };
    } 

    /**
    * Handler for when component ready 
    */
    componentDidMount = async () => {
        try {
            await Auth.currentSession().then(res => {
                let jwt = res["idToken"]["jwtToken"];
                StorageService.set(StorageKeys.clientJwt, jwt);
            });
            this.getMerchantBroadcast();
        } catch (error) {
            console.error("Error in component mounting:", error);
        }
    };

    getMerchantBroadcast = async () => {
        try {
            this.setState({ loading: true });
            const response = await DashboardService.getMerchantMessages();
            console.log("merch broad", response);
            if (response && response.success) {
                this.setState({ broadcastMessages: response.broadcastMessagesDetails });
            } else {
                this.setState({ broadcastMessages: [] });
            }
        } catch (error) {
            console.error("Error fetching merchant broadcasts:", error);
        } finally {
            this.setState({loading: false});
        }
    }

    handleBroadcastClose = async(e, messageId) => {
        e.stopPropagation(); // handleFailedTransactions
        this.state={loading:true}
        await DashboardService.updateMerchantBroadcast(messageId);
        this.getMerchantBroadcast();
        this.state={loading:false}

    }

    handleBroadcastWidth = (value) =>{
        if(value.length >= 290){
            return value.substr(0, 290) + "...";
        }
        else{
            return value;
        }
    }

    toggleAccordion = (messageId) => {
        this.setState((prevState) => {
            const { expanded } = prevState;
            const isExpanded = expanded[messageId];
    
            return {
                expanded: {
                    ...expanded,
                    [messageId]: !isExpanded
                }
            };
        });
    };

    render = () => html.apply(this);
}
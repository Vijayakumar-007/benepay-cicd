import { Component } from 'react';
import {html} from './payment-review.html';

/**
 * Component for Review there payment request once again
 * 
 * @author Ragavan
 */
class PaymentReview extends Component {

    /**
     * Constructor for Single Payment
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        this.state = {
            
        }

    }

    /**
     * Handler for when component ready 
     */
    componentDidMount = (prevProps, prevState) => {

    }

    hahdleBack = () =>{
        this.props.backToPaymentForm();
    }

    submitPatmentReqForm =() =>{
        this.props.createPaymentReq();
    }

    render = () => {
        return html.apply(this);
    }
}

export default PaymentReview;

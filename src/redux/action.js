export default class Action {
    static ToggleGlobalProgress = "ToggleGlobalProgress";
    static CommonEvent = "CommonEvent";
    static ClearPaymentSelection = "ClearPaymentSelection";
    static PaymentNavigationEvent = "PaymentNavigationEvent";

    static UpdateDeviceWidth = "UpdateDeviceWidth";
    static UpdateDevice = "UpdateDevice";

    dispatch;

    constructor(_this) {
        this.dispatch = _this.props.dispatch;
    }

    emitCommonEvent() {
        this.dispatch({type: Action.CommonEvent})
    }

    emitPaymentNavigationEvent() {
        this.dispatch({type: Action.PaymentNavigationEvent})
    }

    clearSelectionEvent() {
        this.dispatch({type: Action.ClearPaymentSelection})
    }

    showGlobalProgress(show) {
        this.dispatch({type: Action.ToggleGlobalProgress, showGlobalProgress: show})
    }
}

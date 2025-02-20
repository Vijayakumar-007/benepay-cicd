import Action from "../action";
import {initialState} from "./index";

export default function FrameReducer(state = initialState, action = {}) {
    // console.log('action FrameReducer', action);
    switch (action.type) {
        case Action.ToggleGlobalProgress:
            return {
                ...state,
                showGlobalProgress: action.showGlobalProgress === undefined ? !state.showGlobalProgress : action.showGlobalProgress
            };
        case Action.CommonEvent:
            return {
                ...state,
                commonEvent: !state.commonEvent
            };
        case Action.PaymentNavigationEvent:
            return {
                ...state,
                paymentNavigationEvent: !state.paymentNavigationEvent
            };
        case Action.ClearPaymentSelection:
            return {
                ...state,
                selectedIds: !state.selectedIds
            };
        case Action.UpdateDevice:
            return {
                ...state,
                device: action.device,
            };
        default:
            return state;
    }
}

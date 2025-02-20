import FrameReducer from './frame.reducer';

export const initialState = {
    showGlobalProgress: false,
    commonEvent: false,
    selectedIds: false,
    device: {
        width: 0,
        scale: 0,
        breakpoint: 'xs'
    }
};

export default function RootReducer(state = initialState, action = {}) {
    FrameReducer(state, action);
}

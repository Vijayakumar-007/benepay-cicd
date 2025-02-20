import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassHalf,
  faExclamation,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

const StatusCreator = ({rowStatus}) => {

    return (<>
        {rowStatus === "COMPLETED" && <>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <div style={{height: "28px", width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#a7daa2", borderRadius: '100%', marginRight: '8px'}}>
                  <FontAwesomeIcon icon={faCheck} style={{width: '16px', aspectRatio: 'auto', color: 'white'}} />
              </div>
              <p style={{fontSize: 'var(--font-x-medium)', color: '#1A1A1C', marginTop: '18px'}}>Successful</p>
          </div>
        </>}
        {(rowStatus !== "COMPLETED" && rowStatus !== "INVALID" && rowStatus !== "FAILED") && <>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <div style={{height: "28px", width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#4D9AFF", borderRadius: '100%', marginRight: '8px'}}>
                  <FontAwesomeIcon icon={faHourglassHalf} style={{width: '16px', aspectRatio: 'auto', color: 'white'}} />
              </div>
              <p style={{fontSize: 'var(--font-x-medium)', color: '#1A1A1C', marginTop: '18px'}}>Processing</p>
          </div>
        </>}
        {(rowStatus === "INVALID" || rowStatus === "FAILED")  && <>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <div style={{height: "28px", width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#FF7276", borderRadius: '100%', marginRight: '8px'}}>
                  <FontAwesomeIcon icon={faExclamation} style={{width: '16px', aspectRatio: 'auto', color: 'white'}} />
              </div>
              <p style={{fontSize: 'var(--font-x-medium)', color: '#1A1A1C', marginTop: '18px'}}>Error</p>
          </div>
        </>}
    </>)

}

export default StatusCreator;
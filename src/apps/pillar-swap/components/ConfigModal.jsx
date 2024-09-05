/* eslint-disable react/prop-types */
const ConfigModal = (props) => {
  return (
    <div className="modaly" onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <h4 className="titleHeader">Transaction Settings</h4>

          <div className="row">
            <label className="labelField">Slippage Tolerance</label>
          </div>
          <div className="row">
            <div className="col-md-9 fieldContainer">
              <input
                className="inputField"
                placeholder="1.0%"
                value={props.slippageAmount}
                onChange={(e) => props.setSlippageAmount(e.target.value)}
              />
            </div>
            <div className="col-md-3 inputFieldUnitsContainer">
              <span>%</span>
            </div>
          </div>
          <div className="row">
            <label className="labelField">Transaction Deadline</label>
          </div>
          <div className="row">
            <div className="col-md-9 fieldContainer">
              <input
                className="inputField"
                placeholder="10"
                value={props.deadlineMinutes}
                onChange={(e) => props.setDeadlineMinutes(e.target.value)}
              />
            </div>
            <div className="col-md-3 inputFieldUnitsContainer">
              <span>minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;

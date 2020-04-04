import { enqueueSetState } from "./state";
class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    enqueueSetState(stateChange, this);
  }
}

export default Component;

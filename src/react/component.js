import { renderComponent } from "../react-dom/diff";
import { enqueueSetState } from "./state";
class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  // 这里是同步方法，React中是异步的
  setState(stateChange) {
    // 浅拷贝，将变化的state属性整合到this.state上
    // 同属性下，前者的值会被后者覆盖
    // Object.assign(this.state, stateChange);
    // renderComponent(this);
    enqueueSetState(stateChange, this);
  }
}

export default Component;

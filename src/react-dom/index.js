import { render } from "./render";

const ReactDOM = {
  render: (vnode, container, dom) => {
    container.innerHTML = "";
    return render(vnode, container, dom);
  }
};

export default ReactDOM;

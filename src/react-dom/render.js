import setAttribute from "./dom";
import Component from "../react/component";

/**
 *
 * @param {*} vnode
 * @param {HTMLElement} container
 */
export function render(vnode, container) {
  return container.appendChild(_render(vnode));
}
/**
 *
 * @param {*} vnode
 */
function _render(vnode) {
  if (
    typeof vnode === "undefined" ||
    typeof vnode === "boolean" ||
    vnode === null
  )
    vnode = "";
  if (typeof vnode === "number") vnode = String(vnode);
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }
  if (typeof vnode.tag === "function") {
    const component = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(component, vnode.attrs);
    return component.base;
  }
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    // Notes: 为什么不用for..in而用Object.keys()？
    // 因为前者会有继承链上的属性，后者只有对象本身的属性
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      // 需要特殊处理，像className->class，事件，style
      setAttribute(dom, key, value);
    });
  }
  vnode.children.forEach(child => render(child, dom));
  return dom;
}

/**
 *
 * @param {Object} component
 * @param {Object} props
 */
function createComponent(component, props) {
  // TODO 有更好的写法吗？
  let instance;
  // 类定义组件
  if (component.prototype && component.prototype.render) {
    instance = new component(props);
  }
  // 函数定义组件
  else {
    instance = new Component(props);
    instance.constructor = component;
    instance.render = function() {
      return this.constructor(props);
    };
  }
  return instance;
}

/**
 *
 * @param {Object} component
 * @param {Object} props
 */
function setComponentProps(component, props) {
  component.props = props;
  renderComponent(component);
}

export function renderComponent(component) {
  let base;
  const renderer = component.render();
  base = _render(renderer);
  if (component.base) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate();
    }
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }
  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }
  component.base = base;
  base._component = component;
}

import diff from "./diff";

/**
 *
 * @param {*} vnode
 * @param {HTMLElement} container
 */
export function render(vnode, container, dom) {
  return diff(dom, vnode, container);
}

// /**
//  *
//  * @param {*} vnode Virtual DOM
//  * @return {HTMLElement}
//  */
// function _render(vnode) {
//   if (
//     typeof vnode === "undefined" ||
//     typeof vnode === "boolean" ||
//     vnode === null
//   )
//     vnode = "";
//   if (typeof vnode === "number") vnode = String(vnode);
//   if (typeof vnode === "string") {
//     const textNode = document.createTextNode(vnode);
//     return textNode;
//   }
//   if (typeof vnode.tag === "function") {
//     const component = createComponent(vnode.tag, vnode.attrs);
//     setComponentProps(component, vnode.attrs);
//     return component.dom;
//   }
//   const dom = document.createElement(vnode.tag);
//   if (vnode.attrs) {
//     // Notes: 为什么不用for..in而用Object.keys()？
//     // 因为前者会有继承链上的属性，后者只有对象本身的属性
//     Object.keys(vnode.attrs).forEach(key => {
//       const value = vnode.attrs[key];
//       // 需要特殊处理，像className->class，事件，style
//       setAttribute(dom, key, value);
//     });
//   }
//   vnode.children.forEach(child => render(child, dom));
//   return dom;
// }

// /**
//  *
//  * @param {Object} component
//  * @param {Object} props
//  */
// function createComponent(component, props) {
//   // TODO 有更好的写法吗？
//   let instance;
//   // 类定义组件
//   if (component.prototype && component.prototype.render) {
//     instance = new component(props);
//   }
//   // 函数定义组件
//   else {
//     instance = new Component(props);
//     instance.constructor = component;
//     // 增加render方法，调用构造函数，返回JSX编译后的虚拟DOM
//     instance.render = function() {
//       return this.constructor(props);
//     };
//   }
//   return instance;
// }

// /**
//  *
//  * @param {Object} component
//  * @param {Object} props
//  */
// export function setComponentProps(component, props) {
//   // React v16不建议使用以下生命周期方法
//   if (!component.dom) {
//     if (component.componentWillMount) component.componentWillMount();
//   } else if (component.componentWillReceiveProps) {
//     component.componentWillReceiveProps(props);
//   }
//   component.props = props;
//   renderComponent(component);
// }

// /**
//  *
//  * @param {Object} component Component实例
//  */
// export function renderComponent(component) {
//   let dom;
//   const virtualDOM = component.render();
//   // 已存在真实DOM，非首次挂载，启动WillUpdate生命周期方法
//   if (component.dom && component.componentWillUpdate) {
//     component.componentWillUpdate();
//   }
//   // 即将挂载/更新后的真实DOM
//   dom = _render(virtualDOM);
//   // dom = diff(component.dom, virtualDOM);
//   // 如果已经存在真实DOM，启动DidUpdate的生命周期方法
//   if (component.dom) {
//     if (component.componentDidUpdate) {
//       component.componentDidUpdate();
//     }
//   }
//   // 首次挂载
//   else if (component.componentDidMount) {
//     component.componentDidMount();
//   }
//   // // 将父节点上的本节点替换成新的DOM
//   // if (component.dom && component.dom.parentNode) {
//   //   component.dom.parentNode.replaceChild(dom, component.dom);
//   // }
//   // 储存当前的DOM元素
//   component.dom = dom;
//   dom._component = component;
// }

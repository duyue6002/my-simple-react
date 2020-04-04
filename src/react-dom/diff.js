import setAttribute from "./dom";
import { Component } from "../react";

/**
 *
 * @param {HTMLElement} dom
 * @param {Object} vnode
 * @param {HTMLElement} container
 * @returns {HTMLElement} 更新后的DOM
 */
export default function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode);
  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }
  return ret;
}

/**
 * 与 _render 方法很像，但采用了 diff 算法
 * @param {HTMLElement} dom 真实DOM
 * @param {Object} vnode 虚拟DOM
 * @returns {HTMLElement} 更新后的DOM
 */
function diffNode(dom, vnode) {
  if (
    typeof vnode === "undefined" ||
    typeof vnode === "boolean" ||
    vnode === null
  )
    vnode = "";
  if (typeof vnode === "number") vnode = String(vnode);

  // NOTE - 需要diff文本节点，组件，非文本节点，以及它们的子节点
  let updateDom = dom;
  // vnode是文本节点
  if (typeof vnode === "string") {
    // 当前DOM就是文本节点，只需要更新内容即可
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    }
    // 当前节点不是文本节点，创建一个文本节点来替换当前的DOM
    else {
      updateDom = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(updateDom, dom);
      }
    }
    return updateDom;
  }
  // diff 组件
  if (typeof vnode.tag === "function") {
    return diffComponent(dom, vnode);
  }

  // vnode是普通节点，且真实DOM不存在就要新增DOM
  if (!dom || !isSameNodeType(dom, vnode)) {
    updateDom = document.createElement(vnode.tag);
    // 如果真实DOM存在但与vnode类型不同，需要将原DOM下的子节点转移到新DOM下
    if (dom) {
      [...dom.childNodes].map(node => updateDom.appendChild(node));
      if (dom.parentNode) {
        dom.parentNode.replaceChild(updateDom, dom);
      }
    }
  }

  // diff 属性
  diffAttributes(updateDom, vnode);

  // diff 子节点
  if (
    (updateDom.childNodes && updateDom.childNodes.length > 0) ||
    (vnode.children && vnode.children.length > 0)
  ) {
    diffChildren(updateDom, vnode.children);
  }
  return updateDom;
}

/**
 * 对比节点属性
 * @param {HTMLElement} dom 真实DOM
 * @param {Object} vnode 虚拟DOM
 */
function diffAttributes(dom, vnode) {
  let old = {};
  let attrs = vnode.attrs;

  // 存储原真实OM的属性
  for (let i = 0; i < dom.attributes.length; i++) {
    let attr = dom.attributes[i];
    old[attr.name] = attr.value;
  }

  // 把原真实DOM有、VDOM中没有的属性从真实DOM中移除，设置为undefined
  for (name in old) {
    if (!(name in attrs)) {
      setAttribute(dom, name, void 0);
    }
  }

  // 把VDOM中的属性更新在真实DOM上
  for (name in attrs) {
    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name]);
    }
  }
}

/**
 *
 * @param {HTMLElement} dom 真实DOM
 * @param {Array} vchildren VDOM的children[]
 */
function diffChildren(dom, vchildren) {
  if (vchildren && vchildren.length > 0) {
    const domChildren = dom.childNodes;
    // 将有key值和没有key值的节点分开处理
    let domNoKeyChildren = [];
    let domKeyChildren = {};

    for (let i = 0; i < domChildren.length; i++) {
      const domChild = domChildren[i];
      if (domChild.key) {
        domKeyChildren[domChild.key] = domChild;
      } else {
        domNoKeyChildren.push(domChild);
      }
    }

    let count = 0; // 没有key的子节点已diff的个数
    let domNoKeyChildrenLen = domNoKeyChildren.length;
    for (let i = 0; i < vchildren.length; i++) {
      const vchild = vchildren[i];
      const vKey = vchild.key;
      // 新的子节点
      let child = void 0;
      // NOTE 先把原DOM的对应子节点赋给child
      // 分为有key和无key两种节点
      if (vKey) {
        // 原DOM子节点与虚拟DOM的子节点key相同
        // child赋值为原DOM对应的子节点，以便后面使用
        if (domKeyChildren[vKey]) {
          child = domKeyChildren[vKey];
          domKeyChildren[vKey] = void 0;
        }
      }
      // 当前虚拟DOM没有key，且没有diff的节点比原DOM子节点少
      else if (count < domNoKeyChildrenLen) {
        for (let j = count; j < domNoKeyChildrenLen; j++) {
          let oldDomChild = domNoKeyChildren[j];
          // 是同类型的节点才赋值，才需要diff，非同类型的在下面diffNode会创建新的节点
          if (oldDomChild && isSameNodeType(oldDomChild, vchild)) {
            child = oldDomChild;
            oldDomChild = void 0;
            if (j === domNoKeyChildrenLen - 1) domNoKeyChildrenLen--;
            if (j === count) count++;
            break;
          }
        }
      }
      // diff后更新的子节点DOM
      child = diffNode(child, vchild);
      // i是已vchildren为基础的，ref是原DOM与vchildren同index下的子节点
      const ref = domChildren[i];
      if (child && child !== dom && child !== ref) {
        // ref 是 undefined，vchildren比domChildren要多，在原DOM下增加当前子节点
        if (!ref) {
          dom.appendChild(child);
        }
        // 当前子节点是ref的下一个，存在于原DOM上，移除ref
        else if (child === ref.nextSibling) {
          removeNode(ref);
        }
        // 当前子节点需要加在ref的前面
        else {
          dom.insertBefore(child, ref);
        }
      }
    }
  }
}

/**
 *
 * @param {HTMLElement} dom
 * @param {Object} vnode
 * @returns {HTMLElement} 更新后的DOM
 */
function diffComponent(dom, vnode) {
  // 获取原DOM对应的组件实例
  let component = dom && dom._component;
  let oldDom = dom;
  // 原组件和更新组件是同类，只需要更新props，并重新render得到更新DOM
  if (component && component.constructor === vnode.tag) {
    setComponentProps(component, vnode.attrs);
    dom = component.dom;
  }
  // 原DOM不是自定义组件，或组件类型不同
  else {
    // 组件类型不同，需要执行当前组件的unmount周期方法
    if (component) {
      unmountComponent(component);
      oldDom = null;
    }
    // 原DOM不是组件渲染而来，创建组件并render出新的DOM
    component = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(component, vnode.attrs);
    dom = component.dom;
    // 原DOM和新DOM不同，把原DOM从页面中移除
    if (oldDom && oldDom !== dom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }
  return dom;
}

/**
 *
 * @param {HTMLElement} dom
 */
function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}

/**
 *
 * @param {Object} component Component实例
 */
function unmountComponent(component) {
  if (component.componentWillUnmount) {
    component.componentWillUnmount();
  }
  removeNode(component.dom);
}

/**
 *
 * @param {HTMLElement} dom
 * @param {Object} vnode
 */
function isSameNodeType(dom, vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return dom.nodeType === 3;
  }
  if (typeof vnode.tag === "string") {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }
  return dom && dom._component && dom._component.constructor === vnode.tag;
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
    // 增加render方法，调用构造函数，返回JSX编译后的虚拟DOM
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
  // React v16不建议使用以下生命周期方法
  if (!component.dom) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }
  component.props = props;
  renderComponent(component);
}

/**
 *
 * @param {Object} component Component实例
 */
export function renderComponent(component) {
  let dom;
  const virtualDOM = component.render();
  // 已存在真实DOM，非首次挂载，启动WillUpdate生命周期方法
  if (component.dom && component.componentWillUpdate) {
    component.componentWillUpdate();
  }
  // 即将挂载/更新后的真实DOM
  dom = diffNode(component.dom, virtualDOM);
  // 如果已经存在真实DOM，启动DidUpdate的生命周期方法
  if (component.dom) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate();
    }
  }
  // 首次挂载
  else if (component.componentDidMount) {
    component.componentDidMount();
  }
  // 储存当前的DOM元素
  component.dom = dom;
  dom._component = component;
}

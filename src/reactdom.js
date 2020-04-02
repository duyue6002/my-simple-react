/**
 *
 * @param {String|Object} vnode
 * @param {HTMLElement} container
 */
function render(vnode, container) {
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
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
  return container.appendChild(dom);
}

/**
 *
 * @param {HTMLElement} dom
 * @param {String} key
 * @param {String|Object} value
 */
function setAttribute(dom, key, value) {
  if (key === "className") {
    key = "class";
  }
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || "";
  } else if (key === "style") {
    // 可以接受对象和字符串
    if (!value || typeof value === "string") {
      dom.style.cssText = value || "";
    } else if (value && typeof value === "object") {
      // 避免是null
      Object.keys(value).forEach(styleAttr => {
        // style={{width: 20}}
        dom.style[styleAttr] =
          typeof value[styleAttr] === "number"
            ? value[styleAttr] + "px"
            : value[styleAttr];
      });
    }
  } else {
    if (key !== "class" && key in dom) {
      dom[key] = value || "";
    }
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
}

const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = "";
    return render(vnode, container);
  }
};

export default ReactDOM;
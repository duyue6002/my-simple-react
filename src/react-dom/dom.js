/**
 *
 * @param {HTMLElement} dom
 * @param {String} key
 * @param {String|Object} value
 */
export default function setAttribute(dom, key, value) {
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

import diff from "./diff";

/**
 *
 * @param {*} vnode
 * @param {HTMLElement} container
 */
export function render(vnode, container, dom) {
  return diff(dom, vnode, container);
}

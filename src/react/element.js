export default function createElement(tag, attrs, ...children) {
  attrs = attrs || {}
  return {
    tag,
    attrs,
    children,
    key: attrs.key || null
  };
}
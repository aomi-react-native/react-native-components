/**
 * 判断是否是ReactText string | number
 * @param node
 */
export function hasReactText(node) {
  const type = typeof node;
  return ['number', 'string'].includes(type);
}

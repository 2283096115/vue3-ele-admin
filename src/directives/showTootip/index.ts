import { camelize } from "vue";
import { isClient } from "@vueuse/core";
import { Directive, type DirectiveBinding, type VNode } from "vue";
import type { CSSProperties } from "vue";

const getStyle = (
  element: HTMLElement,
  styleName: keyof CSSProperties
): string => {
  if (!isClient || !element || !styleName) return "";
  let key = camelize(styleName);
  if (key === "float") key = "cssFloat";
  try {
    const style = (element.style as any)[key];
    if (style) return style;
    const computed: any = document.defaultView?.getComputedStyle(element, "");
    return computed ? computed[key] : "";
  } catch {
    return (element.style as any)[key];
  }
};
export const showTip: Directive = {
  mounted(el: HTMLElement, binding?: DirectiveBinding, vnode?: VNode) {
    const tooltipNode = (vnode.children as VNode[]).find(
      childCmpt => childCmpt.component?.type.name == "ElTooltip"
    );
    if (tooltipNode) {
      el.addEventListener("mouseenter", () => {
        tooltipNode.component.props.disabled = true;
        const range = document.createRange();
        range.setStart(el, 0);
        range.setEnd(el, el.childNodes.length);
        const rangeWidth = Math.round(range.getBoundingClientRect().width);
        const padding =
          (parseInt(getStyle(el, "paddingLeft"), 10) || 0) +
          (parseInt(getStyle(el, "paddingRight"), 10) || 0);
        if (
          rangeWidth + padding > el.offsetWidth ||
          el.scrollWidth > el.offsetWidth
        ) {
          tooltipNode.component.props.disabled = false;
        }
      });
    }
  }
};

/** 订单类型 */
export const orderType = [
  {
    label: "新产品研发",
    value: "NEW_PRODUCT"
  },
  {
    label: "客户排程",
    value: "CUSTOMER_SCHEDULE"
  },
  {
    label: "普通销售订单",
    value: "NORMAL_SALE"
  }
];

/** 订单类型映射 */
export const orderTypeMap = orderType.reduce((pre, cur) => {
  pre[cur.value] = cur.label;
  return pre;
}, {});

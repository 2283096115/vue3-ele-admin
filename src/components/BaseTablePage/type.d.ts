export type formLabelType = {
  // label
  label: string;
  prop: string;
  /** 类型 **/
  type?: "input" | "date" | "select";
  /** type为select的时候需要，下拉框内容 */
  options?: Array<{ label: string; value: string | number }>;
  /** type为select的时候需要 是否多选 */
  multiple?: boolean;
  /** 默认值 */
  value?: string | number | [];
};

export type optionType = {
  apis?: {
    list: {
      func: (params: object) => Promise;
      formatParams?: function;
      format?: function;
    };
    create: {
      func: function;
      formatParams?: function;
    };
    deleteApi: {
      func: function;
      formatParams?: function;
      paramsKey?: string;
      valueKey?: string;
    };
    update: {
      func: function;
      formatParams?: function;
    };
    export: {
      func: function;
    };
    import: {
      func: function;
    };
  };
  showDetail?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  formRule?: Partial<Record<string, Arrayable<FormItemRule>>>;
  updatedHook?: function;
};

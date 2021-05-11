type optionType = {
  label: string;
  value: string;
};

const util = {
  // 根据选项键值获取选项标签
  getLabelByValue: (optionsArr: Array<optionType>, value: string) => {
    const labelArr = optionsArr.filter((item: optionType) => {
      return item.value === value;
    });
    if (labelArr.length) {
      return labelArr[0].label;
    } else {
      return '-';
    }
  }
};

export default util;

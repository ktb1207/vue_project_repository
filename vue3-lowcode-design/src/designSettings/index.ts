import { PropSelect, PropResize, PropValue } from '@/utils/index';

export interface ResizeType {
  resizeFormItem: PropResize;
  resizeTitle: string;
  propKey: string;
  propValue: PropValue;
  propSelect: PropSelect;
}

export interface ISettingPropDataType {
  propArr: Array<ResizeType>;
  id: number;
}

export { default as DesignSetting } from './DesignSetting';

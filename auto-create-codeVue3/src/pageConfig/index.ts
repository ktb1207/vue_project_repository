import pageConfig from './pageConfig.json';
import { DefaultRender as ElementType } from '@/admin/utils/EditRegister';

interface PageItemType {
  // 文件名称，路由名称，大写字母开头
  fileName: string;
  // 页面描述
  pageDesc: string;
  // id
  id: number;
  // 页面配置
  children: Array<ElementType>;
}

export { pageConfig, PageItemType, ElementType };

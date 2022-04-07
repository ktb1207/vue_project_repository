export {
  useComponentRegister,
  IRegisterComponentType,
  IRenderNodeType,
  IRegisterComponentMapType,
  IComponentPropType,
  PropSelect,
  PropResize,
  PropValue
} from './useComponentRegister';
export { useMaterialRegister } from './useMaterialRegister';
export { deepClone } from './deepClone';
export { EventBus } from './EventBus';

export function isHasProperty(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// export function deepClone<T>(value: T): T {
//   return JSON.parse(JSON.stringify(value));
// }

export function buildTreeDataByLevelData<T>(arr: Array<T>, uniqueId = 'id', parentIdName = 'parentId'): Array<T> {
  let treeArr: Array<any> = [];
  const map: any = {};
  arr.forEach((item: any) => {
    item.children = item.children ?? [];
    if (!map[item[uniqueId]]) {
      map[item[uniqueId]] = item;
    }
  });
  arr.forEach((item: any) => {
    if (item[parentIdName] !== null) {
      if (map[item[parentIdName]]) {
        map[item[parentIdName]].children.push(item);
      }
    }
  });
  // 过滤后仅剩下根节点
  const filterArr = arr.filter((item: any) => {
    if (item[parentIdName] === null) {
      return item;
    }
  });
  treeArr = [...filterArr];
  return treeArr;
}

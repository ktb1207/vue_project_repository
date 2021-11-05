const utils = {
  deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  },
  buildTreeDataByLevelData<T>(arr: Array<T>, uniqueId = 'id', parentIdName = 'parentId'): Array<T> {
    let treeArr: Array<any> = [];
    const map: any = {};
    arr.forEach((item: any) => {
      item.children = [];
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
};

export { utils };

export function delayAdd(index: number, item: Array<string>, delayNum: number = 800): Promise<string> {
  return new Promise((resolve) => {
    const timeOut = setTimeout(() => {
      resolve(item[index]);
    }, delayNum);
    if (index > item.length - 1) {
      clearTimeout(timeOut);
    }
  });
}

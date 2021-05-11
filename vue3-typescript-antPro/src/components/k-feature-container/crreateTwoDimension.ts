function useCrreateTwoDimension(arr: Array<any>, lg = 8) {
  const twoDimension: Array<any> = [];
  let oneLgArr: Array<any> = [];

  arr.forEach((item, index) => {
    oneLgArr.push(item);

    if (oneLgArr.length >= lg) {
      twoDimension.push(oneLgArr);
      oneLgArr = [];
    }
    if (index === arr.length - 1) {
      twoDimension.push(oneLgArr);
    }
  });

  return twoDimension;
}

export default useCrreateTwoDimension;

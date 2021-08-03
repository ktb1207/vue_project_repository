const arr = [1, 2, 3, 4, 5, 6];

function add(total, currentV, currentI) {
  console.log(total, currentV, currentI);
  return total + currentV;
}

arr.reduce(add);

// 1 2 1
// 4 3 3 2
// 4 6 4 3
// 4 10 5 4
// 4 15 6 5
// 21

// 求最大值
function maxArr(total, currentV) {
  return total > currentV ? total : currentV;
}

arr.reduce(maxArr);

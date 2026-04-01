export function generateAdvancedSteps(code, type) {

  if (type === "array") {
    return [
      { arr: [3,1,2] },
      { arr: [1,3,2] },
      { arr: [1,2,3] }
    ];
  }

  if (type === "linkedlist") {
    return [
      { prev: null, curr: { val: 1, next: { val: 2 } } },
      { final: { val: 2, next: { val: 1 } } }
    ];
  }

  if (type === "tree") {
    return [
      { root: { val: 1 } },
      { root: { val: 1, left: { val: 2 }, right: { val: 3 } } }
    ];
  }

  return [{ step: "Execution..." }];
}
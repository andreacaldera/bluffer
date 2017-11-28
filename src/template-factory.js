export default () => {
  function methodOne() {
    return 'method one';
  }

  return Object.freeze({
    methodOne,
  });
};

export const TEST = 1;

export function methodTwo() {
  return 'method two';
}

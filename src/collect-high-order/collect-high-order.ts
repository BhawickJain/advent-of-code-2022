const collect = <T>(repeat: number, callbackFn: () => T): Array<T> => {
  const arrOfT: T[] = [];
  for (let i = 0; i < repeat; i++) {
    arrOfT.push(callbackFn());
  }

  return arrOfT;
};

export default collect;

/** Transform object keys into values and vice-versa */
export const flipObject = <O extends Record<string, string>>(object: O) : Invert<O> => {
  return Object.keys(object).reduce((result, key) => {
    result[object[key]] = key;
    return result;
  }, {} as Invert<O>);
};


/* Adapted from https://stackoverflow.com/questions/56415826/is-it-possible-to-precisely-type-invert-in-typescript */
type KeyFromValue<V, T extends Record<string, string>> = {
  [K in keyof T]: V extends T[K] ? K : never
}[keyof T];

type Invert<T extends Record<string, string>> = {
  [V in T[keyof T]]: KeyFromValue<V, T>
};

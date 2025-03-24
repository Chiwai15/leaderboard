export function filterFields<T extends object, K extends keyof T>(
    obj: T,
    allowedKeys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    allowedKeys.forEach((key) => {
      const value = obj[key];
      if (value !== undefined && value !== "") {
        result[key] = value;
      }
    });
    return result;
  }
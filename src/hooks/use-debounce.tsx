import { useEffect } from "react";

const useDebounce = (
  customFunction: () => void,
  depedencies: unknown[],
  delay: number
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      customFunction();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [customFunction, delay, depedencies]);
};

export default useDebounce;

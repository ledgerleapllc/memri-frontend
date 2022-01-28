import { useEffect, useState } from "react";

export const useDelayInput = (defaultValue) => {
  const [params, setParams] = useState(defaultValue);
  const [searchTerm, setSearchTerm] = useState('');

  const resetParams = () => {
    setParams({ search: null });
    setSearchTerm('');
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm || (!searchTerm && params?.search)) {
        setParams({ ...params, search: searchTerm?.trim() || null });
      }
    }, 700)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return { params, setSearchTerm, resetParams, setParams }
}
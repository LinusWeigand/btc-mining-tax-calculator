import { useState } from 'react';

export const useForceUpdate = () => {
    const [update, setUpdate] = useState(0);
    return () => setUpdate((value) => value + 1);
  };
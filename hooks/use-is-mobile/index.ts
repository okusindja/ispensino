import { useCallback, useState } from 'react';

import useEventListener from '../use-event-listener';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleSetDesktop = useCallback(() => {
    const mediaIsMobile = !window.matchMedia('(min-width: 55em)').matches;
    setIsMobile(mediaIsMobile);
  }, []);

  useEventListener('resize', handleSetDesktop, true);

  return isMobile;
};

export default useIsMobile;

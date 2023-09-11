import { useEffect, useState } from 'react';

function useMouseButtonDown(button = 0) {
  const [isButtonDown, setIsButtonDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === button) {
        setIsButtonDown(true);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === button) {
        setIsButtonDown(false);
      }
    };

    // Attach event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [button]);

  return isButtonDown;
}

export {useMouseButtonDown};
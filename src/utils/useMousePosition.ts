import React from 'react';
export type mousePosition = {
  x: null | number;
  y: null | number;
};
const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = React.useState<mousePosition>({ x: null, y: null });
  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};
export {useMousePosition};
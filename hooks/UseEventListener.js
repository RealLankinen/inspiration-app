import { useRef, useEffect } from 'react'

export function UseEventListener(eventName, handler, element=window){

  const savedHandler = useRef()
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler])

  useEffect(
    () => {
      const isSupported = element && element.addListener;
      if (!isSupported) return;
      const eventListener = event => savedHandler.current(event);
      element.addListener(eventName, eventListener);
      return () => {
        element.removeListener(eventName, eventListener);
      };
    },
    [eventName, element]
  )
}
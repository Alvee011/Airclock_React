/**
 * @file Defines a custom React hook, `useInterval`, for setting up declarative intervals.
 * This hook is a more React-friendly way to use `setInterval`.
 */

import { useEffect, useRef } from 'react';

/**
 * A custom React hook for setting up a declarative interval.
 * It behaves like `setInterval` but is designed to work seamlessly with React's lifecycle and state.
 * @param {() => void} callback The function to be executed at each interval.
 * @param {number | null} delay The delay in milliseconds between executions. If `null`, the interval is paused.
 */
export function useInterval(callback: () => void, delay: number | null) {
  // `useRef` is used to store the latest version of the callback function.
  // This avoids re-setting the interval every time the callback function changes
  // due to re-renders, which can happen if it's defined inside the component body.
  const savedCallback = useRef<(() => void) | null>(null);

  // When the component re-renders and the callback function changes,
  // we update the `savedCallback` ref to hold the new callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // This effect sets up and cleans up the interval.
  useEffect(() => {
    // The `tick` function is what gets called by `setInterval`.
    // It calls the latest callback stored in our ref.
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    
    // Only set the interval if the delay is not null (i.e., the interval is not paused).
    if (delay !== null) {
      const id = setInterval(tick, delay);
      
      // The cleanup function returned by `useEffect` will clear the interval
      // when the component unmounts or when the `delay` value changes.
      return () => clearInterval(id);
    }
  }, [delay]);
}

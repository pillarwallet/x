/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { XInterface, XInterfaceConfig } from './XInterface';

export function useXInterface(config?: XInterfaceConfig) {
  const xInterfaceRef = useRef<XInterface | null>(null);

  useEffect(() => {
    xInterfaceRef.current = new XInterface(config);

    return () => {
      xInterfaceRef.current?.destroy();
      xInterfaceRef.current = null;
    };
  }, [config]);

  const registerMethod = (name: string, method: (...args: any[]) => any) => {
    xInterfaceRef.current?.registerMethod(name, method);
  };

  const registerMethods = (
    methods: Record<string, (...args: any[]) => any>
  ) => {
    xInterfaceRef.current?.registerMethods(methods);
  };

  const callIframeMethod = (
    iframe: HTMLIFrameElement,
    method: string,
    ...args: any[]
  ) => {
    return xInterfaceRef.current?.callIframeMethod(iframe, method, ...args);
  };

  return {
    registerMethod,
    registerMethods,
    callIframeMethod,
  };
}

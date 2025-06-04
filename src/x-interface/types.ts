/* eslint-disable @typescript-eslint/no-explicit-any */
export type XInterfaceMessage = {
  type: string;
  payload: any;
  id?: string;
};

export type XInterfaceMethod = (...args: any[]) => any;

export type XInterfaceMethods = {
  [key: string]: XInterfaceMethod;
};

export type XInterfaceConfig = {
  allowedOrigins?: string[];
  methods?: XInterfaceMethods;
};

export type XInterfaceResponse = {
  id: string;
  result?: any;
  error?: string;
};

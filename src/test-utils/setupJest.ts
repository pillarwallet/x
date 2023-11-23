import React from 'react';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-styled-components';

jest.mock('@firebase/app');
jest.mock('@firebase/analytics');
jest.mock('@privy-io/react-auth', () => ({
  PrivyProvider: ({ children }: { children: React.ReactNode }) => children,
  usePrivy: () => jest.fn(),
  useWallets: () => jest.fn(),
}));

process.env.REACT_APP_PRIVY_APP_ID = 'test';

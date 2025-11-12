import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest';

import {
  requestSigning,
  signAuthorizationViaWebView,
  signMessageViaWebView,
  signTransactionViaWebView,
} from '../pillarWalletMessaging';

declare global {
  // eslint-disable-next-line vars-on-top,no-var
  var ReactNativeWebView:
    | { postMessage: (message: string) => void }
    | undefined;
}

const DEFAULT_RESPONSE = {
  type: 'pillarWalletSigningResponse',
  value: { result: 'mock-signature' },
};

/**
 * Dispatches a signing response to the window listeners registered by requestSigning.
 */
const dispatchSigningResponse = (payload: unknown) => {
  const event = new MessageEvent('message', {
    data: JSON.stringify(payload),
  });
  window.dispatchEvent(event);
};

beforeEach(() => {
  vi.restoreAllMocks();
  // Provide a deterministic ReactNativeWebView bridge for each test.
  window.ReactNativeWebView = {
    postMessage: vi.fn(),
  };
});

afterEach(() => {
  delete window.ReactNativeWebView;
});

describe('requestSigning', () => {
  it('resolves with the signature result payload', async () => {
    const signingPromise = requestSigning('signMessage', { foo: 'bar' });

    expect(window.ReactNativeWebView?.postMessage).toHaveBeenCalledTimes(1);
    const posted = JSON.parse(
      (window.ReactNativeWebView?.postMessage as Mock).mock.calls[0][0]
    );

    expect(posted).toMatchObject({
      type: 'pillarXSigningRequest',
      value: 'signMessage',
    });

    dispatchSigningResponse(DEFAULT_RESPONSE);

    await expect(signingPromise).resolves.toBe('mock-signature');
  });

  it('rejects when the response contains an error', async () => {
    const signingPromise = requestSigning('signTransaction', { foo: 'bar' });

    dispatchSigningResponse({
      type: 'pillarWalletSigningResponse',
      value: { error: 'failed' },
    });

    await expect(signingPromise).rejects.toThrow('failed');
  });

  it('stringifies BigInt values before posting to the bridge', async () => {
    requestSigning('signTypedData', { amount: BigInt(123) });

    const posted = JSON.parse(
      (window.ReactNativeWebView?.postMessage as Mock).mock.calls[0][0]
    );

    const parsedData = JSON.parse(posted.data);
    expect(parsedData.amount).toBe('123');
  });
});

describe('signing helpers', () => {
  it('formats signMessage requests correctly and resolves with signature', async () => {
    const promise = signMessageViaWebView('hello-world');

    const posted = JSON.parse(
      (window.ReactNativeWebView?.postMessage as Mock).mock.calls[0][0]
    );
    const parsedData = JSON.parse(posted.data);

    expect(parsedData).toEqual({ message: 'hello-world' });

    dispatchSigningResponse(DEFAULT_RESPONSE);
    await expect(promise).resolves.toBe('mock-signature');
  });

  it('passes through transaction payloads for signTransaction', async () => {
    const txPayload = {
      to: '0x0000000000000000000000000000000000000001',
      value: '0x1',
    } as unknown;
    const promise = signTransactionViaWebView(
      txPayload as unknown as import('viem').TransactionSerializable
    );

    const posted = JSON.parse(
      (window.ReactNativeWebView?.postMessage as Mock).mock.calls[0][0]
    );
    const parsedData = JSON.parse(posted.data);

    expect(parsedData).toEqual(txPayload);

    dispatchSigningResponse(DEFAULT_RESPONSE);
    await expect(promise).resolves.toBe('mock-signature');
  });

  it('returns a SignedAuthorization with BigInt v parsed from the bridge response', async () => {
    const authPromise = signAuthorizationViaWebView({
      address: '0xabc0000000000000000000000000000000000000',
      chainId: 1,
      nonce: 7,
    });

    const bridgeResult = {
      type: 'pillarWalletSigningResponse',
      value: {
        result: JSON.stringify({
          address: '0xabc0000000000000000000000000000000000000',
          chainId: 1,
          nonce: 7,
          r: '0x01',
          s: '0x02',
          v: '27',
          yParity: 0,
        }),
      },
    };

    dispatchSigningResponse(bridgeResult);

    const signedAuth = await authPromise;

    expect(signedAuth).toEqual({
      address: '0xabc0000000000000000000000000000000000000',
      chainId: 1,
      nonce: 7,
      r: '0x01',
      s: '0x02',
      v: BigInt(27),
      yParity: 0,
    });
  });
});

import {
  XInterfaceConfig,
  XInterfaceMessage,
  XInterfaceMethods,
  XInterfaceResponse,
  XInterfaceMethod,
} from './types';

export type { XInterfaceConfig };

export class XInterface {
  private methods: XInterfaceMethods = {};
  private allowedOrigins: string[] = [];
  private messageHandlers: Map<string, (response: XInterfaceResponse) => void> =
    new Map();

  constructor(config: XInterfaceConfig = {}) {
    this.methods = config.methods || {};
    this.allowedOrigins = config.allowedOrigins || ['*'];

    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private handleMessage(event: MessageEvent) {
    if (!this.isAllowedOrigin(event.origin)) {
      console.warn(
        `Received message from unauthorized origin: ${event.origin}`
      );
      return;
    }

    const message = event.data as XInterfaceMessage;
    if (!message || !message.type) return;

    if (message.type === 'x-interface:call') {
      this.handleMethodCall(event.source as Window, event.origin, message);
    }
  }

  private isAllowedOrigin(origin: string): boolean {
    return (
      this.allowedOrigins.includes('*') || this.allowedOrigins.includes(origin)
    );
  }

  private async handleMethodCall(
    source: Window,
    origin: string,
    message: XInterfaceMessage
  ) {
    const { payload, id } = message;
    const { method, args } = payload;

    try {
      if (!this.methods[method]) {
        throw new Error(`Method ${method} not found`);
      }

      const result = await this.methods[method](...args);
      this.sendResponse(source, origin, { id: id!, result });
    } catch (error) {
      this.sendResponse(source, origin, {
        id: id!,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private sendResponse(
    target: Window,
    origin: string,
    response: XInterfaceResponse
  ): void {
    target.postMessage(
      {
        type: 'x-interface:response',
        payload: response,
      },
      origin
    );
  }

  public registerMethod(name: string, method: XInterfaceMethod): void {
    this.methods[name] = method;
  }

  public registerMethods(methods: XInterfaceMethods): void {
    this.methods = { ...this.methods, ...methods };
  }

  public callIframeMethod(
    iframe: HTMLIFrameElement,
    method: string,
    ...args: unknown[]
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7);

      this.messageHandlers.set(id, (response) => {
        this.messageHandlers.delete(id);
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.result);
        }
      });

      iframe.contentWindow?.postMessage(
        {
          type: 'x-interface:call',
          id,
          payload: { method, args },
        },
        '*'
      );
    });
  }

  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.messageHandlers.clear();
  }
}

import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

// hooks
import { useClickOutside } from '../useClickOutside';

describe('useClickOutside', () => {
  let mockRef: React.RefObject<HTMLDivElement>;
  let mockCallback: ReturnType<typeof vi.fn>;
  let mockCondition: boolean;

  beforeEach(() => {
    // Create a mock DOM element
    const mockElement = document.createElement('div');
    mockElement.textContent = 'test element';

    mockRef = {
      current: mockElement,
    };

    mockCallback = vi.fn();
    mockCondition = true;

    // Clear any existing event listeners
    document.removeEventListener('mousedown', vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clean up event listeners - remove all mousedown listeners
    const listeners = document.querySelectorAll('*');
    listeners.forEach((el) => {
      el.removeEventListener('mousedown', vi.fn());
    });
    document.removeEventListener('mousedown', vi.fn());
  });

  it('should call callback when clicking outside element and condition is true', () => {
    renderHook(() =>
      useClickOutside({
        ref: mockRef,
        callback: mockCallback,
        condition: mockCondition,
      })
    );

    // Simulate click outside the element
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(mousedownEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    document.dispatchEvent(mousedownEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Clean up
    document.body.removeChild(outsideElement);
  });

  it('should not call callback when condition is false', () => {
    renderHook(() =>
      useClickOutside({
        ref: mockRef,
        callback: mockCallback,
        condition: false,
      })
    );

    // Simulate click outside the element
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(mousedownEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    document.dispatchEvent(mousedownEvent);

    expect(mockCallback).not.toHaveBeenCalled();

    // Clean up
    document.body.removeChild(outsideElement);
  });

  it('should not call callback when ref is null', () => {
    const nullRef = { current: null };

    renderHook(() =>
      useClickOutside({
        ref: nullRef,
        callback: mockCallback,
        condition: mockCondition,
      })
    );

    // Simulate click outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(mousedownEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    document.dispatchEvent(mousedownEvent);

    expect(mockCallback).not.toHaveBeenCalled();

    // Clean up
    document.body.removeChild(outsideElement);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useClickOutside({
        ref: mockRef,
        callback: mockCallback,
        condition: mockCondition,
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should handle multiple calls with different conditions', () => {
    const { rerender } = renderHook(
      ({ condition }) =>
        useClickOutside({
          ref: mockRef,
          callback: mockCallback,
          condition,
        }),
      { initialProps: { condition: true } }
    );

    // First click with condition true
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    let mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(mousedownEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    document.dispatchEvent(mousedownEvent);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Update condition to false
    rerender({ condition: false });

    // Second click with condition false
    mousedownEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(mousedownEvent, 'target', {
      value: outsideElement,
      writable: false,
    });

    document.dispatchEvent(mousedownEvent);
    expect(mockCallback).toHaveBeenCalledTimes(1); // Should not increase

    // Clean up
    document.body.removeChild(outsideElement);
  });
});

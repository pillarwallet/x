import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

// hooks
import { useKeyboardNavigation } from '../useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  let mockOnEscape: ReturnType<typeof vi.fn>;
  let mockOnEnter: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnEscape = vi.fn();
    mockOnEnter = vi.fn();

    // Clear any existing event listeners
    document.removeEventListener('keydown', vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clean up event listeners
    document.removeEventListener('keydown', vi.fn());
  });

  it('should call onEscape when Escape key is pressed', () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
        enabled: true,
      })
    );

    // Simulate Escape key press
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);

    expect(mockOnEscape).toHaveBeenCalledTimes(1);
  });

  it('should call onEnter when Enter key is pressed and onEnter is provided', () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
        enabled: true,
      })
    );

    // Simulate Enter key press
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });

    document.dispatchEvent(enterEvent);

    expect(mockOnEnter).toHaveBeenCalledTimes(1);
  });

  it('should not call onEnter when Enter key is pressed and onEnter is not provided', () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        enabled: true,
      })
    );

    // Simulate Enter key press
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });

    document.dispatchEvent(enterEvent);

    expect(mockOnEnter).not.toHaveBeenCalled();
  });

  it('should not handle keys when disabled', () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
        enabled: false,
      })
    );

    // Simulate Escape key press
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);

    expect(mockOnEscape).not.toHaveBeenCalled();
  });

  it('should not handle keys when enabled is not provided (defaults to true)', () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
      })
    );

    // Simulate Escape key press
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);

    expect(mockOnEscape).toHaveBeenCalledTimes(1);
  });

  it('should ignore other keys', () => {
    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
        enabled: true,
      })
    );

    // Simulate other key presses
    const otherKeys = ['a', 'b', 'Space', 'Tab', 'ArrowUp'];

    otherKeys.forEach((key) => {
      const keyEvent = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
      });

      document.dispatchEvent(keyEvent);
    });

    expect(mockOnEscape).not.toHaveBeenCalled();
    expect(mockOnEnter).not.toHaveBeenCalled();
  });

  it('should prevent default behavior for handled keys', () => {
    const mockPreventDefault = vi.fn();

    renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
        enabled: true,
      })
    );

    // Simulate Escape key press with preventDefault mock
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    escapeEvent.preventDefault = mockPreventDefault;
    document.dispatchEvent(escapeEvent);

    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useKeyboardNavigation({
        onEscape: mockOnEscape,
        onEnter: mockOnEnter,
        enabled: true,
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should handle multiple calls with different enabled states', () => {
    const { rerender } = renderHook(
      ({ enabled }) =>
        useKeyboardNavigation({
          onEscape: mockOnEscape,
          onEnter: mockOnEnter,
          enabled,
        }),
      { initialProps: { enabled: true } }
    );

    // First Escape press with enabled true
    let escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);
    expect(mockOnEscape).toHaveBeenCalledTimes(1);

    // Update enabled to false
    rerender({ enabled: false });

    // Second Escape press with enabled false
    escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);
    expect(mockOnEscape).toHaveBeenCalledTimes(1); // Should not increase
  });

  it('should handle callback changes', () => {
    const newOnEscape = vi.fn();
    const { rerender } = renderHook(
      ({ onEscape }) =>
        useKeyboardNavigation({
          onEscape,
          onEnter: mockOnEnter,
          enabled: true,
        }),
      { initialProps: { onEscape: mockOnEscape } }
    );

    // First Escape press with original callback
    let escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);
    expect(mockOnEscape).toHaveBeenCalledTimes(1);
    expect(newOnEscape).not.toHaveBeenCalled();

    // Update callback
    rerender({ onEscape: newOnEscape });

    // Second Escape press with new callback
    escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });

    document.dispatchEvent(escapeEvent);
    expect(mockOnEscape).toHaveBeenCalledTimes(1); // Should not increase
    expect(newOnEscape).toHaveBeenCalledTimes(1);
  });
});

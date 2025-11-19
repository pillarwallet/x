import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';

// utils
import * as imageUtils from '../../utils/imageUtils';

// components
import ImageUpload from '../ImageUpload';

describe('<ImageUpload />', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock FileReader
    global.FileReader = class FileReader {
      result: string | null = null;
      onload: ((this: FileReader, ev: Event) => void) | null = null;
      onerror: ((this: FileReader, ev: Event) => void) | null = null;

      readAsDataURL(file: Blob) {
        setTimeout(() => {
          this.result = 'data:image/png;base64,mockBase64Data';
          if (this.onload) {
            this.onload({} as Event);
          }
        }, 0);
      }
    } as any;
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <ImageUpload label="Logo" value="" onChange={mockOnChange} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays label', () => {
    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('displays required indicator when required', () => {
    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} required />);

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('displays description when provided', () => {
    render(
      <ImageUpload
        label="Logo"
        value=""
        onChange={mockOnChange}
        description="Upload a logo image"
      />
    );

    expect(screen.getByText('Upload a logo image')).toBeInTheDocument();
  });

  it('displays preview image when value is provided', () => {
    const base64Image = 'data:image/png;base64,mockBase64Data';
    render(<ImageUpload label="Logo" value={base64Image} onChange={mockOnChange} />);

    const preview = screen.getByAltText('Preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', base64Image);
  });

  it('shows upload button when no image is uploaded', () => {
    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('shows change button when image is already uploaded', () => {
    const base64Image = 'data:image/png;base64,mockBase64Data';
    render(<ImageUpload label="Logo" value={base64Image} onChange={mockOnChange} />);

    expect(screen.getByText('Change Image')).toBeInTheDocument();
  });

  it('calls onChange with base64 when valid image is uploaded', async () => {
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({ valid: true });
    vi.spyOn(imageUtils, 'fileToBase64').mockResolvedValue('data:image/png;base64,mockBase64Data');

    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    const fileInput = screen.getByRole('button', { name: /upload image/i });
    fireEvent.click(fileInput);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['mock'], 'test.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('data:image/png;base64,mockBase64Data');
    });
  });

  it('displays error when file validation fails', async () => {
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({
      valid: false,
      error: 'Invalid file type. Please use PNG, JPG, GIF, or WEBP.',
    });

    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    const fileInput = screen.getByRole('button', { name: /upload image/i });
    fireEvent.click(fileInput);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['mock'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(
        screen.getByText('Invalid file type. Please use PNG, JPG, GIF, or WEBP.')
      ).toBeInTheDocument();
    });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('displays error prop when provided', () => {
    render(
      <ImageUpload
        label="Logo"
        value=""
        onChange={mockOnChange}
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange with empty string when remove button is clicked', () => {
    const base64Image = 'data:image/png;base64,mockBase64Data';
    render(<ImageUpload label="Logo" value={base64Image} onChange={mockOnChange} />);

    const removeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('shows processing state while uploading', async () => {
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({ valid: true });
    vi.spyOn(imageUtils, 'fileToBase64').mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve('data:image/png;base64,mockBase64Data'), 100);
        })
    );

    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    const fileInput = screen.getByRole('button', { name: /upload image/i });
    fireEvent.click(fileInput);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['mock'], 'test.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(screen.getByText('Processing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('displays error when file processing fails', async () => {
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({ valid: true });
    vi.spyOn(imageUtils, 'fileToBase64').mockRejectedValue(new Error('Processing failed'));

    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    const fileInput = screen.getByRole('button', { name: /upload image/i });
    fireEvent.click(fileInput);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['mock'], 'test.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Failed to process image')).toBeInTheDocument();
    });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('disables upload button while processing', async () => {
    vi.spyOn(imageUtils, 'validateImageFile').mockReturnValue({ valid: true });
    vi.spyOn(imageUtils, 'fileToBase64').mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve('data:image/png;base64,mockBase64Data'), 100);
        })
    );

    render(<ImageUpload label="Logo" value="" onChange={mockOnChange} />);

    const fileInput = screen.getByRole('button', { name: /upload image/i });
    fireEvent.click(fileInput);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['mock'], 'test.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    const uploadButton = screen.getByRole('button', { name: /processing/i });
    expect(uploadButton).toBeDisabled();

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});


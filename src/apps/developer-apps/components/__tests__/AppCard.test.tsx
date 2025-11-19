import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import { DeveloperApp } from '../../api/developerAppsApi';

// components
import AppCard from '../AppCard';

describe('<AppCard />', () => {
  const mockApp: DeveloperApp = {
    appId: 'test-app',
    ownerEoaAddress: '0x1234567890123456789012345678901234567890',
    name: 'Test App',
    shortDescription: 'This is a test application',
    longDescription: 'This is a longer description',
    tags: 'defi, trading, nft',
    logo: 'https://example.com/logo.png',
    banner: 'https://example.com/banner.png',
    supportEmail: 'support@example.com',
    launchUrl: 'https://example.com',
    socialTelegram: 'https://t.me/test',
    socialX: 'https://x.com/test',
    socialFacebook: 'https://facebook.com/test',
    socialTiktok: 'https://tiktok.com/@test',
    isApproved: true,
    isInReview: false,
    createdAt: 1609459200000, // 2021-01-01
    updatedAt: 1609459200000,
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnSendForReview = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <AppCard
          app={mockApp}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onSendForReview={mockOnSendForReview}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays app name and app ID', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('test-app')).toBeInTheDocument();
  });

  it('displays app description', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText('This is a test application')).toBeInTheDocument();
  });

  it('displays app tags', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText('defi')).toBeInTheDocument();
    expect(screen.getByText('trading')).toBeInTheDocument();
    expect(screen.getByText('nft')).toBeInTheDocument();
  });

  it('displays logo when provided', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    const logo = screen.getByAltText('Test App logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
  });

  it('shows LIVE status for approved apps', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('shows Unpublished status for unapproved apps', () => {
    const unapprovedApp = { ...mockApp, isApproved: false, isInReview: false };
    render(
      <AppCard
        app={unapprovedApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText('Unpublished:')).toBeInTheDocument();
    expect(screen.getByText('Send for review?')).toBeInTheDocument();
  });

  it('shows In Review status when app is in review', () => {
    const inReviewApp = { ...mockApp, isApproved: false, isInReview: true };
    render(
      <AppCard
        app={inReviewApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText('(In Review)')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith('test-app');
  });

  it('calls onDelete when Delete button is clicked', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('test-app');
  });

  it('calls onSendForReview when Send for review button is clicked', () => {
    const unapprovedApp = { ...mockApp, isApproved: false, isInReview: false };
    render(
      <AppCard
        app={unapprovedApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    const sendForReviewButton = screen.getByText('Send for review?');
    fireEvent.click(sendForReviewButton);

    expect(mockOnSendForReview).toHaveBeenCalledWith('test-app');
  });

  it('displays social links when provided', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);

    const telegramLink = socialLinks.find(
      (link) => link.getAttribute('href') === 'https://t.me/test'
    );
    expect(telegramLink).toBeInTheDocument();
  });

  it('displays created date', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
  });

  it('displays updated date when different from created date', () => {
    const updatedApp = {
      ...mockApp,
      updatedAt: 1612137600000, // 2021-02-01
    };
    render(
      <AppCard
        app={updatedApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.getByText(/Updated:/i)).toBeInTheDocument();
  });

  it('does not display updated date when same as created date', () => {
    render(
      <AppCard
        app={mockApp}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSendForReview={mockOnSendForReview}
      />
    );

    expect(screen.queryByText(/Updated:/i)).not.toBeInTheDocument();
  });
});


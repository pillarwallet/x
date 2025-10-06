import styled from 'styled-components';

// Shared colors
export const colors = {
  background: '#1a1a1a',
  border: '#333',
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    accent: '#8b5cf6',
  },
  status: {
    success: '#4ade80',
    error: '#ef4444',
  },
  button: {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
  },
};

// Shared typography
export const typography = {
  title: `
    font-size: 18px;
    font-weight: 600;
    color: ${colors.text.primary};
  `,
  body: `
    font-size: 14px;
    line-height: 1.5;
    color: ${colors.text.primary};
  `,
  small: `
    font-size: 12px;
    line-height: 1.5;
    color: ${colors.text.secondary};
  `,
};

// Shared components
export const BaseContainer = styled.div`
  background: ${colors.background};
  border: 1px solid ${colors.border};
`;

export const BaseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

export const BaseTitle = styled.h2`
  ${typography.title};
  margin: 0;
`;

export const IconWrapper = styled.span`
  font-size: 18px;
`;
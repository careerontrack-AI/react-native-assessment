import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../src/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders correctly with default props', () => {
    const { UNSAFE_getByType } = render(<LoadingSpinner />);
    expect(UNSAFE_getByType('ActivityIndicator')).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { UNSAFE_getByType } = render(<LoadingSpinner size="small" />);
    const activityIndicator = UNSAFE_getByType('ActivityIndicator');
    expect(activityIndicator.props.size).toBe('small');
  });

  it('renders with custom color', () => {
    const { UNSAFE_getByType } = render(<LoadingSpinner color="#FF0000" />);
    const activityIndicator = UNSAFE_getByType('ActivityIndicator');
    expect(activityIndicator.props.color).toBe('#FF0000');
  });
});


import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  // Suppress console.error for this test
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test Content</Text>
      </ErrorBoundary>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders error UI when there is an error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(getByText(/Something went wrong/i)).toBeTruthy();
  });
});


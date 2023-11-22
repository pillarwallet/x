import React from 'react';
import renderer from 'react-test-renderer';

// components
import App from './App';

describe('<App />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<App />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});


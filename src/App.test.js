import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
// import renderer from 'react-test-renderer';
import App from './App';

describe('Addition TEST', () => {
  test('2 + 2 is 4', () => {
    expect(2 + 2).toBe(4);
  });
});

describe('Intro tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

// describe('App', () => {
//   test('snapshot renders', () => {
//     const component = renderer.create(<App />);
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });

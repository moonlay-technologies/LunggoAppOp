import 'react-native';
import React from 'react';
import ExploreScreen from '../ExploreScreen';
// import renderer from 'react-test-renderer';

//// _onSearchTextChanged
// it('changes text when user input', () => {
//   event = {nativeEvent.text: 'aa'}
//   _onSearchTextChanged(event)
//   expect(ExploreScreen.state.searchString).toBe('aa');
// });

// it('', () => {
//   _onSearchPressed()
//   expect(variable).toBe(result);
// });

// it('renders the root without loading screen', async () => {
//   // const tree = renderer.create(<App skipLoadingScreen />).toJSON();
//   _executeQuery(query)
//   // expect(tree).toMatchSnapshot();
// });

//// _handleResponse(response)
it('renders the loading screen', async () => {
  // const tree = renderer.create(<App />).toJSON();
  _handleResponse(response)
  // expect(tree).toMatchSnapshot();
});


//// unexported function

// it('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
const calculateTotalDistance = require('../src/calculateTotalDistance.js')

test('it calculates the distance for a route', () => {
  var result = 0;
  expect(calculateTotalDistance(result)).toEqual(0);
  // expect(coordsObjectToArray([{lat: 0, lng: 0}])).toEqual([[0,0]]);
})
//
// test('it convers an array of two objects to a 2d array', () => {
//   expect(coordsObjectToArray([{lat: 0, lng: 0}, {lat: 100, lng: 100}])).toEqual([[0,0],[100,100]])
// })
//
// test('it converts an array of five objects to a 2d array', () => {
//   expect(coordsObjectToArray([ { lat: 51.51787669999999, lng: -0.07620069999995849 },
//   { lat: 51.52581606811841, lng: -0.06343865245844427 },
//   { lat: 51.5337592191676, lng: -0.07620069999995849 },
//   { lat: 51.52581606811841, lng: -0.08896274754147271 },
//   { lat: 51.51787669999999, lng: -0.07620069999995849 } ])).toEqual([[51.51787669999999,-0.07620069999995849],
//   [51.52581606811841, -0.06343865245844427],[51.5337592191676, -0.07620069999995849],
//   [51.52581606811841, -0.08896274754147271],[51.51787669999999, -0.07620069999995849]])
// });

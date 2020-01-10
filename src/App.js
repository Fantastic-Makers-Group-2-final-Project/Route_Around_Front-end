import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline } from 'google-maps-react';
import CurrentLocation from './Map';

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [
        {latitude: 51.5196879, longitude: 0.0187932},
        {latitude: 51.5445368, longitude: 0.0117855}
      ],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });


  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return <Marker key={index} id={index} position={{
       lat: store.latitude,
       lng: store.longitude
     }}
     onClick={() => console.log("You clicked me!")} />
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Ready for your route??');
  }

  render() {
    return (
      <div class='App'>
      <div>
        <h1>Route Around App</h1>
      <div>
      <form class='App' onSubmit={this.handleSubmit}>
        <label>
          Post Code:
          <input
            name="postCode"
            type="text"
            value={this.state.postCode}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <br />
        <label>
          5 kilometers:
          <input
            name="5km"
            type="checkbox"
            checked={this.state.distance5}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          10 kilometers:
          <input
            name="10km"
            type="checkbox"
            checked={this.state.distance10}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <br />
        <input type="submit" value="GO!" />
        <br />
      </form>
      <div>
        <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
          <Marker onClick={this.onMarkerClick} name={'current location'} />
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
            </div>
          </InfoWindow>
          {this.displayMarkers()}
          <Polyline path={[{ lat: 51.5196879, lng: 0.0187932}, {lat: 51.5445368, lng: 0.0117855}]}/>
        </CurrentLocation>
      </div>
      </div>
      </div>
      </div>
    );
  }
}

// export default App;
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDro0XKEZYd8mj42cXWVukmO0WKJstaAYs'
})(MapContainer);

/*global google*/
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, GoogleApiWrapper, Marker, InfoWindow, Polyline, DirectionsRenderer, GoogleMapReact } from 'google-maps-react';
import CurrentLocation from './CurrentLocation';

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [
        { lat: 51.5178767, lng: -0.0762007 },
        { lat: 51.52581606811841, lng: -0.06343865245844427 },
        { lat: 51.5337592191676, lng: -0.07620069999995849 },
        { lat: 51.52581606811841, lng: -0.08896274754147271 },
        { lat: 51.5178767, lng: -0.0762007 }
      ],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      postCode: ''
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
       lat: store.lat,
       lng: store.lng
     }}
     onClick={() => console.log("You clicked me!")} />
    })
  }

  componentDidMount() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var center = new google.maps.LatLng(51.5178767, -0.0762007)
    var mapOptions = {
      center: center,
      zoom: 17
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);

    directionsService.route({
      origin: new google.maps.LatLng(51.5178767, -0.0762007),
      destination: new google.maps.LatLng(51.5178767, -0.0762007),
      waypoints: [
        {
          location: new google.maps.LatLng(51.52581606811841, -0.06343865245844427)
        },
        {
          location: new google.maps.LatLng(51.5337592191676, -0.07620069999995849)
        },
        {
          location: new google.maps.LatLng(51.52581606811841, -0.08896274754147271)
        }
      ],
      avoidHighways: true,
      travelMode: 'WALKING',
      region: 'gb'
    }, function (result, status) {
      directionsRenderer.setDirections(result);
    })
  }

  handleChange(event) {
    this.setState({postCode: event.target.value});
  }

  handleSubmit(event) {
    alert('Ready for your route?? your postcode is ' + this.state.postCode);
  }

  render() {
    return (
      <div className='App'>
      <div>
        <h1>Route Around App</h1>
      <div>
      <form className='App' onSubmit={this.handleSubmit}>
        <label>
          Post Code:
          <input
            name="postCode"
            type="text"
            value={this.state.postCode}
            onChange={this.handleChange} />
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
      <div id='map'>
        <CurrentLocation yesIWantToUseGoogleMapApiInternals centerAroundCurrentLocation google={this.props.google}>
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
  apiKey: 'AIzaSyDro0XKEZYd8mj42cXWVukmO0WKJstaAYs&callback='
})(MapContainer);

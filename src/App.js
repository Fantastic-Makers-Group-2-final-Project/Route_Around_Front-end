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
      postCode: '',
      distance: 0,
      geocoder: {},
      postCodeCoords: {}
    }
    this.handlePostcodeChange = this.handlePostcodeChange.bind(this);
    this.handleDistanceChange = this.handleDistanceChange.bind(this);
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

  getCoordinates = async (postcode) => {
    const locator = new google.maps.Geocoder();
    const coords = await new Promise(function(resolve, reject) {
      locator.geocode({ 'address': postcode }, function(results, status) {
        resolve(results);
      })
    })
    return { lat: coords[0].geometry.location.lat(), lng: coords[0].geometry.location.lng() }
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
      origin: new google.maps.LatLng(this.state.stores[0]),
      destination: new google.maps.LatLng(this.state.stores[4]),
      waypoints: [
        {location: new google.maps.LatLng(this.state.stores[1])},
        {location: new google.maps.LatLng(this.state.stores[2])},
        {location: new google.maps.LatLng(this.state.stores[3])}
      ],
      avoidHighways: true,
      travelMode: 'WALKING',
      region: 'gb'
    }, function (result, status) {
      directionsRenderer.setDirections(result);
    })
  }

  handlePostcodeChange(event) {
    this.setState({postCode: event.target.value});
  }

  handleDistanceChange(event) {
    this.setState({distance: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault()
    this.getCoordinates(this.state.postCode)
    .then(result => {
      alert('Ready for your ' + this.state.distance + 'km, your postcode is ' + this.state.postCode);
      this.setState({postCodeCoords: result});
      var data = {
        'coordinates': this.state.postCodeCoords,
        'distance': this.state.distance
      }
      console.log(data)
      fetch('https://routearound-back.herokuapp.com/generate-waypoint-coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        console.log(response)
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        this.setState({stores: myJson})
        console.log(this.state.stores)
      });
    })
    .catch(error => {
      alert(error)
    })
  };


  render() {
    return (
      <div className='App'>
      <div>
        <h1>Route Around</h1>
      <div>
      <form className='App' onSubmit={this.handleSubmit}>
        <label>
          Start Location:
          <input
            name="postCode"
            type="text"
            value={this.state.postCode}
            onChange={this.handlePostcodeChange} />
            (PostCode)
        </label>
        <br />
        <br />
        <label>
          Distance:
          <input
            name="distance"
            type="number"
            value={this.state.distance}
            onChange={this.handleDistanceChange} />
            Kilometres
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

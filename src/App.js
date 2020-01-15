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
      stores: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      postCode: '',
      distance: 0,
      actualDistance: 0,
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

  computeTotalDistance = async (coordsData) => {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true, draggable: true, map: map, panel: document.getElementById('right-panel')});
    var center = new google.maps.LatLng(51.5178767, -0.0762007);

    var mapOptions = {
      center: center,
      zoom: 17
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    directionsRenderer.setMap(map);

    let actualDistance = await new Promise((resolve, reject) => {
      directionsService.route({
        origin: new google.maps.LatLng(coordsData[0]),
        destination: new google.maps.LatLng(coordsData[0]),
        waypoints: [
          {location: new google.maps.LatLng(coordsData[1])},
          {location: new google.maps.LatLng(coordsData[2])},
          {location: new google.maps.LatLng(coordsData[3])}
        ],
        avoidHighways: true,
        travelMode: 'WALKING',
        region: 'gb'
      }, function (result, _status) {
        var total = 0;
        var route = result.routes[0];
        for (var i = 0; i < route.legs.length; i++) {
          total += route.legs[i].distance.value;
        }
        resolve(total / 1000);
      })
    });

    return actualDistance
  };

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
      fetch('https://routearound-back.herokuapp.com/generate-waypoint-coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        return response.json();
      }).then(async (coordsData) => {
        let actualDistance = await this.computeTotalDistance(coordsData);
        return { stores: coordsData, actualDistance: actualDistance }
      })
      .then((data) => {
        this.setState({stores: data.stores, actualDistance: data.actualDistance})
      })
    })
    .catch(error => {
      alert(error)
    })
  };

  componentDidMount() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var center = new google.maps.LatLng(51.5178767, -0.0762007)
    var mapOptions = {
      center: center,
      zoom: 5
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
  }

  componentDidUpdate() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true, draggable: true, map: map, panel: document.getElementById('#')});
    var center = new google.maps.LatLng(51.5178767, -0.0762007)
    var mapOptions = {
      center: center,
      zoom: 17
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);

    directionsService.route({
      origin: new google.maps.LatLng(this.state.stores[0]),
      destination: new google.maps.LatLng(this.state.stores[0]),
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
        <div id="right-panel">
            <label>
              <p>Total Distance: <span id="total">{this.state.actualDistance}</span></p>
            </label>
        </div>
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

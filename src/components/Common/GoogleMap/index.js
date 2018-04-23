/*
 * 
 *  Authored by Vineet Verma (vkv000@gmail.com)
 */
import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends React.Component {
	constructor(props){
		super(props);
		const {lat, lng} = this.props.initialCenter;
	    
	    this.state = {
	      	currentLocation: {
	        	lat: lat,
	        	lng: lng
	      	}
	    }
	}

	componentDidMount() {
		if (this.props.centerAroundCurrentLocation) {
	        if (navigator && navigator.geolocation) {
	            navigator.geolocation.getCurrentPosition((pos) => {
	                const coords = pos.coords;
	                this.setState({
	                    currentLocation: {
	                        lat: coords.latitude,
	                        lng: coords.longitude
	                    }
	                })
	            })
	        }
	    }
  		this.loadMap();
	}

	loadMap() {
    	if (this.props && this.props.google) {
      		const {lat, lng} = this.state.currentLocation;
    	}
  	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.selectedLat !== this.props.selectedLat){
				this.setState({currentLocation : {lat : this.props.selectedLat, lng : this.props.selectedLng}});
		}

    	if (prevProps.google !== this.props.google) {
      		this.loadMap();
    	}
  	}

	render() {
	    return (
	    	<Map
				google={this.props.google}
				zoom={15}
				width={this.props.width}
				height={this.props.height}
				center={this.state.currentLocation}>
			<Marker position={this.state.currentLocation} name={'Current location'}/>

	        <InfoWindow onClose={this.onInfoWindowClose}>
	            <div>
	              	<h1>Demo</h1>
	            </div>
	        </InfoWindow>
	      </Map>
	    );
  	}
}

MapContainer.propTypes = {
  	google: React.PropTypes.object,
  	zoom: React.PropTypes.number,
  	initialCenter: React.PropTypes.object,
  	centerAroundCurrentLocation: React.PropTypes.bool
}

MapContainer.defaultProps = {
  	zoom: 13,
  	// San Francisco, by default
  	initialCenter: {
    	lat: 37.774929,
    	lng: -122.419416
  	},
  	centerAroundCurrentLocation: true
}

export default GoogleApiWrapper({
  	apiKey: ("AIzaSyAeqVLF53tO1_iTWVJT1ud9FgdGl1-71L4")
})(MapContainer)

import React from 'react';
import ReactDOM from 'react-dom';
import actions from '../../redux/actions';
import {connect} from 'react-redux';

@connect(state => ({
  
}))

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 37.774929,
            longitude: -122.419416
        }
       
    }

    componentDidMount() {
        console.log(this.props)
        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: {
                lat: parseFloat(this.state.latitude),
                lng: parseFloat(this.state.longitude)
            },
            zoom: 13
        });

        let address = this.props.address+" "+this.props.city_name+" "+this.props.state_name+" "+this.props.country_name;
        let getaddress  = this.props;
        var geocoder = new window.google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            let lat= results[0].geometry.location.lat();
            let long= results[0].geometry.location.lng();
            getaddress.dispatch({
                type: 'GET_LAT_LONG_GMAP',
                lat: lat,
                long: long
              });
            if (status == google.maps.GeocoderStatus.OK) {
                let marker = new window.google.maps.Marker({
                    map: map,
                    position: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                });

                let place = "Sodala";
                let location = results[0].geometry.location;

                map.fitBounds(results[0].geometry.viewport);
                map.setCenter(location);
            } else {
                console.log("________________ CANNOT FIND THE ADDRESS")
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.showmapLocation(nextProps)
    }

    showmapLocation(getProps) {
        let address = getProps.address+" "+getProps.city_name+" "+getProps.state_name+" "+getProps.country_name;
        
        let map = new window.google.maps.Map(document.getElementById('map'), {
            center: {
                lat: parseFloat(this.state.latitude),
                lng: parseFloat(this.state.longitude)
            },
            zoom: 13
        });

        var geocoder = new window.google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            let lat= results[0].geometry.location.lat();
            let long= results[0].geometry.location.lng();
        getProps.dispatch({
                type: 'GET_LAT_LONG_GMAP',
                lat: lat,
                long: long
              });

            if (status == google.maps.GeocoderStatus.OK) {
                let marker = new window.google.maps.Marker({
                    map: map,
                    position: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                });

                let place = "Sodala";
                let location = results[0].geometry.location;

                map.fitBounds(results[0].geometry.viewport);
                map.setCenter(location);
            } else {
                console.log("________________ CANNOT FIND THE ADDRESS")
            }
        });
    }
    render() {
        return (
            <div id='map' style={{height: '250px'}}/>
        ); 
    }   
};
var map = new google.maps.Map(
	document.getElementById('map'),
	{
		center:{lat: 39.8282, lng: -98.5795},
		zoom: 4
	}
);

var infoWindow = new google.maps.InfoWindow({});
var markers = [];
var poiMarkers = [];
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
}

function createPoI(place){
	// console.log(place);
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: place.icon
	})
	google.maps.event.addListener(marker, 'click', () =>{
		infoWindow.setContent(place.name);
		infoWindow.open(map, marker);
	})
	poiMarkers.push(marker);
}

function calcRoute() {
  // var start = document.getElementById('start').value;
  // var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}

initialize();
// calcRoute();

var start = 'Atlanta, GA';
var end;

function createMarker(city){
	var icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569';
	var cityLL = {
		lat: city.lat,
		lng: city.lng
	}
	var marker = new google.maps.Marker({
		position: cityLL,
		map: map,
		title: city.city,
		icon: icon
	})

	google.maps.event.addListener(marker,'click',function(){
	   infoWindow.setContent(`<h2> ${city.city}</h2><div>${city.state}</div><div>${city.yearEstimate}</div><a href="#" onClick={this.zoomIn}>Click to Zoom</a>`);
	   infoWindow.open(map,marker);
	 });

	markers.push(marker);
}

var GoogleCity = React.createClass({
	handleClickedCity: function(event){
		// console.log('clicked');
		google.maps.event.trigger(markers[this.props.cityObject.yearRank - 1],"click")
	},

	zoomIn: function(event){
		var cityLL = new google.maps.LatLng(this.props.cityObject.lat, this.props.cityObject.lng);
		map = new google.maps.Map(
			document.getElementById('map'),
			{
				center: cityLL,
				zoom: 12
			}
		)
		directionsDisplay.setMap(map);

		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(
			{
				location: cityLL,
				radius: 10000,
			},
			function(results, status){
				// console.log(results);
				if(status === "OK"){
					results.map(function(currPlace, index){
						createPoI(currPlace);
					})
				}
			}
		);

		var bounds = new google.maps.LatLngBounds(cityLL);
		poiMarkers.map(function(currMarker, index){
			bounds.extend(currMarker.getPosition());
		})
		runFitBounds();
	},

	runFitBounds: function(){
		map.fitBounds(bounds);
	},

	getEnd: function(event){
		end = event.target.value
		// console.log(end);
	},

	getDirections: function(event){
		end = this.props.cityObject.city;
		markers.map(function(marker, index){
			marker.setMap(null);
		});
		calcRoute();
	},

	render: function(){
		return(	
			<tr>
				<td className="cityName" onClick={this.handleClickedCity}>{this.props.cityObject.city}</td>
				<td className="cityRank">{this.props.cityObject.yearRank}</td>
				<td className="cityEnd"><button id="end" type="button" value={this.props.cityObject.city + ', ' + this.props.cityObject.state} lat={this.props.cityObject.lat} lng={this.props.cityObject.lng} onClick={this.getDirections}>To Here</button></td>
				<td className="cityZoom"><button type="button" onClick={this.zoomIn}>Zoom In</button></td>
			</tr>		
		);
	}
});

var Cities = React.createClass({
	getInitialState: function() {
		return{
			currCities: this.props.routes[1].cities
		}
	},

	handleInputChange: function(event){
		var newFilterValue = event.target.value;
		var filteredCitiesArray = [];
		
		this.props.routes[1].cities.map(function(currCity, index){
			if(currCity.city.toUpperCase().indexOf(newFilterValue.toUpperCase()) !== -1){
				// it's in the word
				
				filteredCitiesArray.push(currCity);
			}
		});
		this.setState({
			currCities: filteredCitiesArray

		})
	},

	getStart: function(event){
		start = event.target.value
	},

	updateMarkers: function(event){
		event.preventDefault();
		markers.map(function(marker, index){
			marker.setMap(null);
		});
		this.state.currCities.map(function(city, index){
			createMarker(city)
		});
	},

	render: function() {
		var cityRows = [];
		this.state.currCities.map(function(currentCity, index){
			// console.log(currentCity.city, index)
			createMarker(currentCity)
			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />);
		});
		return(
			<div id="mapArea">
				<form onSubmit={this.updateMarkers}>
					<input type="text" placeholder="Search Cities"onChange={this.handleInputChange} />
					<input type="submit" value="Update Markers" />
				</form>
				<form>
					<label>Set Origin: <input type="text" placeholder="City, State" onChange={this.getStart} /></label>
				</form>
				<table>
					<thead>
						<tr>
							<th>City Name</th>
							<th>City Rank</th>
							<th>Get Directions</th>
							<th>Zoom</th>
						</tr>
					</thead>
					<tbody>
						{cityRows}
					</tbody>
				</table>
			</div>
		);
	}
});

function Test(props){
	return(
		<h1>This is test.</h1>
	)
}

var App = React.createClass({
	render: function(){
		return(
			<div>
				<BootstrapNavBar />
				{this.props.children}
			</div>
		)
	}
})

var BootstrapNavBar = React.createClass({
	render: function(){
		return(
			<nav className="navbar navbar-default">
 				<div className="container-fluid">
   					<div className="navbar-header">
     					<a className="navbar-brand" href="#">WebSiteName</a>
   					</div>
   					<ul className="nav navbar-nav">
	     				<li><ReactRouter.IndexLink activeClassName="active" to="/">Home</ReactRouter.IndexLink></li>
	     				<li><ReactRouter.Link activeClassName="active" to="/cities">Test</ReactRouter.Link></li>
   					</ul>
				</div>
			</nav>
		)
	}
})

ReactDOM.render(
	<ReactRouter.Router>
		<ReactRouter.Route path="/" component={App}>
			<ReactRouter.IndexRoute component={Cities} cities={cities}/>
			<ReactRouter.Route path="/cities" component={Test} />
		</ReactRouter.Route>
	</ReactRouter.Router>,
	document.getElementById('cities-container')
)
var map = new google.maps.Map(
	document.getElementById('map'),
	{
		center:{lat: 39.8282, lng: -98.5795},
		zoom: 4
	}
);

function zoomMap(citylat, citylng){
	console.log(citylat, citylng);
	var map = new google.maps.Map(
		document.getElementById('map'),
		{
			center:{lat: citylat, lng: citylng},
			zoom: 12
		}
	);
}

var infoWindow = new google.maps.InfoWindow({});
var markers = [];

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
	   infoWindow.setContent(`<h2> ${city.city}</h2><div>${city.state}</div><div>${city.yearEstimate}</div><a href="#" onClick={zoomMap(${city.lat},${city.lng});}>Click to Zoom</a>`);
	   infoWindow.open(map,marker);
	 });

	markers.push(marker);
}

var GoogleCity = React.createClass({
	handleClickedCity: function(event){
		// console.log('clicked');
		google.maps.event.trigger(markers[this.props.cityObject.yearRank - 1],"click")
	},
	render: function(){
		return(	
			<tr>
				<td className="cityName" onClick={this.handleClickedCity}>{this.props.cityObject.city}</td>
				<td className="cityRank">{this.props.cityObject.yearRank}</td>
			</tr>		
		);
	}
});

var Cities = React.createClass({
	getInitialState: function() {
		return{
			currCities: this.props.cities
		}
	},

	handleInputChange: function(event){
		var newFilterValue = event.target.value;
		var filteredCitiesArray = [];
		
		this.props.cities.map(function(currCity, index){
			if(currCity.city.toUpperCase().indexOf(newFilterValue.toUpperCase()) !== -1){
				// it's in the word
				
				filteredCitiesArray.push(currCity);
			}
		});
		this.setState({
			currCities: filteredCitiesArray

		})
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
			<div>
				<form onSubmit={this.updateMarkers}>
					<input type="text" onChange={this.handleInputChange} />
					<input type="submit" value="Update Markers" />
				</form>
				<table>
					<thead>
						<tr>
							<th>City Name</th>
							<th>City Rank</th>
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

ReactDOM.render(
	<Cities cities={cities}/>,
	document.getElementById('cities-container')
)
function GoogleCity(props){
	return(	
					<tr className="cityName">
						<td>{props.cityObject.city}</td>
						<td>{props.cityObject.yearRank}</td>
					</tr>		
	)
}

var Cities = React.createClass({
	render: function() {
		var cityRows = [];
		this.props.cities.map(function(currentCity, index){
			// console.log(currentCity.city, index)
			cityRows.push(<GoogleCity cityObject={currentCity} key={index} />);
		})
		return(
			<div>
				<table>
					<thead>
						<tr>
							<th>City</th>
							<th>Rank</th>
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
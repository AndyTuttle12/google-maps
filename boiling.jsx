function BoilingVerdict(props){
	if(props.celcius >= 100){
		return(
			<p>The water would boil at {props.celcius}</p>
		)
	}else{
		return(
			<p>The water would NOT boil at {props.celcius}</p>
		)
	}
}

var TempuratureInput = React.createClass({
	getInitialState: function() {
		return{value: ''}
	},
	handleChange: function(event){
		this.setState({
			value: event.target.value
		})
	},

	render: function(){
		return(
			<div>
				<label>Enter Temp in question in {this.props.tUnits}</label>
				<input placeholder="Temp" value={this.state.value} onChange={this.handleChange} />
			</div>
		)
	}
})

var Calculator = React.createClass({
	getInitialState: function() {
		return{
			value: ''
		}
	},

	handleChange: function(event){
		this.setState({
			value: event.target.value
		})
	},

	render: function(){
		return(
			<div>
				<TempuratureInput tUnits="Celcius" />
				<TempuratureInput tUnits="Fahrenheit" />
				<BoilingVerdict celcius={Number(1)}/>
			</div>
		);
	}
})

ReactDOM.render(
	<Calculator />,
	document.getElementById('boiling')
)
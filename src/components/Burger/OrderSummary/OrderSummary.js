import React, {Fragment, Component} from 'react';
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {
	// This could be a functional component
	// componentWillUpdate () {
	// 	console.log('[OrderSummary] WillUpdate');
	// }

	render () {
		const ingredientSummary = Object.keys(this.props.ingredients).map(
			igKey => {
				return (
					<li key={igKey} >
						<span style={{textTransform: 'capitalize'}} >{igKey}</span>: {this.props.ingredients[igKey]}
					</li>
				);
			}
		);

		return (
			<Fragment>
				<h3>Your Order</h3>
				<p>A delicious burguer with the following ingredients:</p>
				<ul>
					{ingredientSummary}
				</ul>
				<p><strong>Total Price: ${this.props.price.toFixed(2)}</strong></p>
				<p>Continue to Checkout?</p>
				<Button buttonType="Danger" clicked={this.props.purchaseCancelled} >Cancel</Button>
				<Button buttonType="Success" clicked={this.props.purchaseContinued} >Continue</Button>
			</Fragment>
		);
	}
}

export default OrderSummary;
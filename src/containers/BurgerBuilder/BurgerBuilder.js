import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {...}
	// }
	state = {
		purchasing: false,
	}

	componentDidMount () {
		this.props.onInitIngredients();
	}

	updatePurchaseState (ingredients) {
		// const ingredients = {
		// 	...this.state.ingredients
		// };
		const sum = Object.keys(ingredients).map(
			igKey => {
				return ingredients[igKey];
			}
		).reduce((sum, el) => {
			return sum + el;
		}, 0);
		return sum > 0;
	}

	// addIngredientHandler = (type) => {
	// 	const oldCount = this.state.ingredients[type];
	// 	const updatedCount = oldCount + 1;
	// 	const updatedIngredients = {
	// 		...this.state.ingredients
	// 	};
	// 	updatedIngredients[type] = updatedCount;
	// 	const priceAddition = INGREDIENT_PRICES[type];
	// 	const oldPrice = this.state.totalPrice;
	// 	const newPrice = oldPrice + priceAddition;
	// 	this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
	// 	this.updatePurchaseState(updatedIngredients);		
	// }

	// removeIngredientHandler = (type) => {
	// 	const oldCount = this.state.ingredients[type];
	// 	if (oldCount <= 0) {
	// 		return;
	// 	}
	// 	const updatedCount = oldCount - 1;
	// 	const updatedIngredients = {
	// 		...this.state.ingredients
	// 	};
	// 	updatedIngredients[type] = updatedCount;
	// 	const priceDeduction = INGREDIENT_PRICES[type];
	// 	const oldPrice = this.state.totalPrice;
	// 	const newPrice = oldPrice - priceDeduction;
	// 	this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
	// 	this.updatePurchaseState(updatedIngredients);
	// }

	purchaseHandler =  () => {
		if (this.props.isAuthenticated) {
			this.setState({purchasing: true});
		} else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
	}

	purchaseCancelHandler = () => {
		this.props.onInitPurchase();
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
	}

	render () {
		const disabledInfo = {
			...this.props.ings
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
		if (this.props.ings) {
			burger = (
				<Fragment> 
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						price={this.props.price}
						purchasable={this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler}
						isAuth={this.props.isAuthenticated}
					/>
				</Fragment>
			);
			orderSummary = <OrderSummary
				ingredients={this.props.ings}
				purchaseCancelled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
				price={this.props.price}
			/>
		}

		return (
			<Fragment>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
					{orderSummary}
				</Modal>
				{burger}
			</Fragment>
		);
	}
};

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null,
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(actionTypes.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(actionTypes.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actionTypes.initIngredients()),
		onInitPurchase: () => dispatch(actionTypes.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actionTypes.setAuthRedirectPath(path))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
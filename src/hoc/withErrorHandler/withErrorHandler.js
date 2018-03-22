import React, {Fragment, Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios ) => {
	return class extends Component {
		state = {
			error: null
		}

		componentWillMount () {
			this.requestInterceptor = axios.interceptors.request.use(request => {
				this.setState({error: null});
				return request;
			});
			this.responseInterceptor = axios.interceptors.response.use(response => response, error => {
				this.setState({error: error});
			});
		}

		componentWillUnmount () {
			//console.log('Will Unmount', this.requestInterceptor, this.responseInterceptor);
			axios.interceptors.request.eject(this.requestInterceptor);
			axios.interceptors.response.eject(this.responseInterceptor);
		}

		errorConfirmedHandler = () => {
			this.setState({error: null});
		}

		render () {
			return (
				<Fragment>
					<Modal
						show={this.state.error}
						modalClosed={this.errorConfirmedHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</Fragment>
			);
		}
	}
}

export default withErrorHandler;
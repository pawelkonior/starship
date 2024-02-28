import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  clearError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          {this.props.fallback}
          <p>
            <Link to={'/'} onClick={this.clearError}>
              Powrót do strony głównej
            </Link>
          </p>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

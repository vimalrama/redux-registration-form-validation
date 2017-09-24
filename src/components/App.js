import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegistrationForm from './RegistrationForm';


class App extends Component {
  submit = (values) => {
    const result = {
      ...values,
      bankAccounts: this.props.bankAccounts,
    };
    function replacer(key, value) {
      if (key == 'bankAccount' || key == 'validate') return undefined;
      return value;
    }
    // alert(JSON.stringify({ ...values, ...{ bankAccounts: this.props.bankAccounts } }), null, ' ');
    alert(JSON.stringify(result, replacer, ' '));
  }

  render() {
    return (
      <div style={{ textAlign: 'center', width: '100%', height: '100%' }}>
        <RegistrationForm onSubmit={this.submit} />
      </div>
    );
  }
}

const mapState = state => ({ bankAccounts: state.bankAccounts });

export default connect(mapState)(App);

import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, FormSection, change } from 'redux-form';
import renderField from './renderField';

const validate = (values, props) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'First name is required';
  }
  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!props.bankAccounts || props.bankAccounts.length < 1) {
    errors.bankAccounts = 'You should provide at least one bank account';
  }
  return errors;
};


class RegisterationForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isBankAccountFormVisible: false,
    };
  }

  showBankAccountsForm = () => {
    this.setState({ isBankAccountFormVisible: true });
  }

  hideBankAccountsForm = () => {
    this.setState({ isBankAccountFormVisible: false });
  }

  addBankAccount = () => {
    const bankAccount = this.props.formData.values.bankAccount;
    if (!bankAccount || !bankAccount.IBAN || !bankAccount.bankName) {
      return;
    }
    this.props.dispatch({ type: 'ADD_ACCOUNT', bankAccount });
    this.props.dispatch(change('registeration', 'bankAccount', {}));
  }

  clearData = () => {
    this.props.dispatch({ type: 'CLEAR_ACCOUNTS' });
    this.props.reset();
    this.hideBankAccountsForm();
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="firstName" type="text" component={renderField} label="First name" />
        <Field name="lastName" type="text" component={renderField} label="Last name" />
        <Field name="email" type="email" component={renderField} label="Email" />

        <h3>Bank Accounts</h3>
        <Field name="bankAccounts" type="text" component={({ meta: { touched, error } }) => <span>{touched && error}</span>} />

        <ul>
          {this.props.bankAccounts && this.props.bankAccounts.map(acct => (
            <li key={acct.IBAN}>{acct.bankName} - {acct.IBAN}</li>
          ))}
        </ul>

        { !this.state.isBankAccountFormVisible &&
          <button onClick={this.showBankAccountsForm}>Add Bank Account</button>
        }

        { this.state.isBankAccountFormVisible &&
          <div style={{ margin: '10px', borderColor: 'gray', borderWidth: '1px', borderStyle: 'solid' }}>
            <FormSection name="bankAccount">
              <Field name="IBAN" type="text" component={renderField} label="IBAN" />
              <Field name="bankName" type="text" component={renderField} label="Bank name" />
            </FormSection>
            <button type="button" onClick={this.addBankAccount}>Save Bank</button>
            <button type="button" onClick={this.hideBankAccountsForm}>Cancel</button>
          </div>
        }

        <div style={{ margin: '10px' }}>
          <button type="submit" disabled={submitting}>
            Submit
          </button>
          <button type="button" disabled={pristine || submitting} onClick={this.clearData}>
            Clear Data
          </button>
        </div>
      </form>
    );
  }
}

const mapState = state => ({
  formData: state.form.registeration,
  bankAccounts: state.bankAccounts,
});

export default connect(mapState)(reduxForm({
  form: 'registeration',
  validate,
})(RegisterationForm));

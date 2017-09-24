import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, FormSection, change, touch, blur } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions } from 'material-ui/Card';
import Chip from 'material-ui/Chip';

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

  errors.bankAccount = {};

  // this error will show on the bankAccounts virtual field
  if (!props.bankAccounts || props.bankAccounts.length < 1) {
    errors.bankAccounts = 'You should provide at least one bank account';
  }

  // the next errors will show on the inputs inside the bankAccount FormSection
  if (!values.bankAccount) {
    errors.bankAccount.IBAN = 'IBAN is required';
    errors.bankAccount.bankName = 'Bank name is required';
  }

  if (values.bankAccount && !values.bankAccount.IBAN) {
    errors.bankAccount.IBAN = 'IBAN is required';
  }

  if (values.bankAccount && !values.bankAccount.bankName) {
    errors.bankAccount.bankName = 'Bank name is required';
  }

  return errors;
};

class RegistrationForm extends React.Component {
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
    // if the form is empty
    if (!this.props.formData.values) {
      // We need to show errors on the two inputs inside the form section
      // But they are still untouched, so we have to touch them first
      this.props.dispatch(touch('registration', 'bankAccount.IBAN', 'bankAccount.bankName'));

      // We could instead use the touch prop on the form,
      // But I chose to explicitly dispatch an action because it can be tracked in redux-dev-tools

      // Redux-form runs SyncValidation whenever the form re-renders
      // We need a way to manually trigger a re-render without changing any of our original fields
      // so we created a virtual field for this purpose
      this.props.dispatch(change('registration', 'validate', Math.random()));
      return;
    }

    const { bankAccount } = this.props.formData.values;
    if (!bankAccount || !bankAccount.IBAN || !bankAccount.bankName) {
      // same as above. Touch the fields then force redux-form to validate
      this.props.dispatch(touch('registration', 'bankAccount.IBAN', 'bankAccount.bankName'));
      this.props.dispatch(blur('registration', 'validate', Math.random()));
      return;
    }

    // No errors? save the account
    this.props.dispatch({ type: 'ADD_ACCOUNT', bankAccount });

    // clear the bank account fields
    this.props.dispatch(change('registration', 'bankAccount.IBAN', ''));
    this.props.dispatch(change('registration', 'bankAccount.bankName', ''));

    this.hideBankAccountsForm();
  }

  handleRequestDelete = (IBAN) => {
    this.props.dispatch({ type: 'REMOVE_ACCOUNT', IBAN });

    // Again, we have to manually trigger validation. To know why:
    // Comment this line and fill out all the form, add a bank account, delete it, and press submit.
    this.props.dispatch(blur('registration', 'validate', Math.random()));
  }

  clearData = () => {
    this.props.dispatch({ type: 'CLEAR_ACCOUNTS' });
    this.hideBankAccountsForm();
    this.props.reset();
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Card style={{ padding: '20px', width: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <h2>Registration Form</h2>
          <div>
            <Field
              name="firstName"
              type="text"
              component={TextField}
              label="First name"
              hintText="First name"
              floatingLabelText="First name"
            />
          </div>
          <div>
            <Field
              name="lastName"
              type="text"
              component={TextField}
              label="Last name"
              hintText="Last name"
              floatingLabelText="Last name"
            />
          </div>
          <div>
            <Field
              name="email"
              type="email"
              component={TextField}
              label="Email"
              hintText="Email"
              floatingLabelText="Email"
            />
          </div>

          {/* Our virtual field to manually trigger validation */}
          <div>
            <Field
              name="validate"
              type="text"
              component={() => <div style={{ display: 'none' }} />}
              label=""
            />
          </div>


          <h3>Bank Accounts</h3>

          {/* We need this component to display the error message even if the FormSection is hidden */}
          <Field
            name="bankAccounts"
            type="text"
            component={({ meta: { touched, error } }) => <span style={{ fontSize: '12px', color: 'rgb(244, 67, 54)' }}>{touched && error}</span>}
          />

          {/* Added Bank Accounts */}
          <div style={{ margin: '10px', width: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            {this.props.bankAccounts && this.props.bankAccounts.map(acct => (
              <Chip
                key={acct.IBAN}
                onRequestDelete={() => this.handleRequestDelete(acct.IBAN)}
                onClick={() => {}}
                style={{ margin: '4px', marginLeft: 'auto', marginRight: 'auto', width: '450px' }}
                deleteIconStyle={{ marginRight: '4px' }}
                labelStyle={{ width: '446px' }}
              >{acct.bankName} - {acct.IBAN}
              </Chip>
            ))}
          </div>


          { !this.state.isBankAccountFormVisible &&
            <RaisedButton onClick={this.showBankAccountsForm} label="Add Bank Account" />
          }

          { this.state.isBankAccountFormVisible &&
            <div>
              <FormSection name="bankAccount">
                <div><Field
                  name="IBAN"
                  type="text"
                  component={TextField}
                  label="IBAN"
                  hintText="IBAN"
                  floatingLabelText="IBAN"
                /></div>
                <div><Field
                  name="bankName"
                  type="text"
                  component={TextField}
                  label="Bank name"
                  hintText="Bank name"
                  floatingLabelText="Bank name"
                /></div>
              </FormSection>
              <CardActions>
                <RaisedButton type="button" onClick={this.addBankAccount} label="Save Bank" />
                <RaisedButton type="button" onClick={this.hideBankAccountsForm} label="Cancel" />
              </CardActions>
            </div>
          }

          <CardActions style={{ marginTop: '10px' }}>
            <RaisedButton type="submit" primary disabled={submitting} label="Submit" />
            <RaisedButton type="button" disabled={pristine || submitting} onClick={this.clearData} label="Clear Data" />
            {/* performing a reset when the form is pristine leads to a bug with redux-form
              https://github.com/erikras/redux-form/issues/3284 */}
          </CardActions>
        </form>
      </Card>
    );
  }
}

const mapState = state => ({
  formData: state.form.registration,
  bankAccounts: state.bankAccounts,
});

export default connect(mapState)(reduxForm({
  form: 'registration',
  validate,
})(RegistrationForm));

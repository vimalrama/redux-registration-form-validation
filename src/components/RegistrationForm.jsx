import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, FormSection, change } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
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


class RegistrationForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    this.props.dispatch(change('registration', 'bankAccount', {}));
    this.hideBankAccountsForm();
  }

  handleRequestDelete = (IBAN) => {
    console.log(IBAN);
    this.props.dispatch({ type: 'REMOVE_ACCOUNT', IBAN });
  }

  clearData = () => {
    this.props.dispatch({ type: 'CLEAR_ACCOUNTS' });
    this.props.reset();
    this.hideBankAccountsForm();
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Paper style={{padding: '20px', width:'600px', marginLeft:'auto', marginRight:'auto'}}>
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


          <h3>Bank Accounts</h3>
          <Field name="bankAccounts" type="text" component={({ meta: { touched, error } }) => <span style={{fontSize: '14px', color: 'rgb(244, 67, 54)'}}>{touched && error}</span>} />


          <div style={{ margin: '10px', width: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            {this.props.bankAccounts && this.props.bankAccounts.map(acct => (
              <Chip
                key={acct.IBAN}
                onRequestDelete={() => this.handleRequestDelete(acct.IBAN)}
                onClick={() => {}}
                style={{ margin: '4px', marginLeft: 'auto', marginRight: 'auto', width: '450px' }}
                deleteIconStyle={{ marginRight: '4px' }}
                labelStyle={{width: '446px'}}
              >{acct.bankName} - {acct.IBAN}</Chip>
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

          <CardActions style={{marginTop: '10px'}}>
            <RaisedButton type="submit" primary disabled={submitting} label="Submit" />
            <RaisedButton type="button" disabled={pristine || submitting} onClick={this.clearData} label="Clear Data" />
          </CardActions>
        </form>
      </Paper>
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

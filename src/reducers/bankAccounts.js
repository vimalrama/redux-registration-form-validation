const bankAccounts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return state.concat(action.bankAccount);
    case 'REMOVE_ACCOUNT':
      return state.filter(acct => acct.IBAN !== action.IBAN);
    case 'CLEAR_ACCOUNTS':
      return [];
    default:
      return state;
  }
};

export default bankAccounts;

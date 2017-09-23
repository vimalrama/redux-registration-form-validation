const bankAccounts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return state.concat(action.bankAccount);
    case 'CLEAR_ACCOUNTS':
      return [];
    default:
      return state;
  }
};

export default bankAccounts;

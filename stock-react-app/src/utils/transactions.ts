export interface Transaction {
  id: string;
  user_id: string;
  user_name: string;
  stock_id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAWAL';
  quantity: number;
  price: number;
  created_at: string;
}

export async function fetchTransactionsForBook(
  stock_id: string | undefined,
): Promise<Transaction[]> {
  const responseTransactions = await fetch(
    `http://localhost:3000/api/transactions/filter?stock_id=${stock_id}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('Fetch transactions response:', responseTransactions);

  const dataTransactions = await responseTransactions.json();
  if (!responseTransactions.ok) {
    console.error('Failed to fetch transactions', dataTransactions);
    throw new Error('Failed to fetch transactions');
  }

  const responseUsers = await fetch(`http://localhost:3000/api/users`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Fetch users response:', responseUsers);

  const dataUsers = await responseUsers.json();
  if (!responseUsers.ok) {
    console.error('Failed to fetch users', dataUsers);
    throw new Error('Failed to fetch users');
  }

  const data = dataTransactions.map((transaction: Transaction) => {
    const userInfo = dataUsers.filter(
      (user: { id: string }) => user.id === transaction.user_id,
    );
    return {
      ...transaction,
      user_name: userInfo.length > 0 ? userInfo[0].name : '',
    };
  });

  return data;
}

export async function fetchTransactionsForUser(
  user_id: string | undefined,
): Promise<Transaction[]> {
  const responseTransactions = await fetch(
    `http://localhost:3000/api/transactions/filter?user_id=${user_id}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('Fetch transactions response:', responseTransactions);

  const dataTransactions = await responseTransactions.json();
  if (!responseTransactions.ok) {
    console.error('Failed to fetch transactions', dataTransactions);
    throw new Error('Failed to fetch transactions');
  }

  return dataTransactions;
}

export interface Customer {
  title: 'Mr.' | 'Mrs.';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    title: 'Mrs.',
    firstName: 'Test',
    lastName: 'Automation',
    email: `qa.${Date.now()}@example.com`,
    password: 'Str0ng!Pass123',
    ...overrides,
  };
}
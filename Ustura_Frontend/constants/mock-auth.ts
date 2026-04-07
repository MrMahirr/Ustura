// TODO: Remove this hard-coded customer once backend auth integration is complete.
export const MOCK_CUSTOMER_CREDENTIALS = {
  identifier: 'demo@ustura.com',
  password: 'ustura123',
} as const;

export const MOCK_CUSTOMER_PROFILE = {
  id: 'customer-demo',
  fullName: 'Demo Musteri',
  initials: 'DM',
  identifier: MOCK_CUSTOMER_CREDENTIALS.identifier,
  email: MOCK_CUSTOMER_CREDENTIALS.identifier,
  phone: '05551234567',
  role: 'customer' as const,
};

export function matchesMockCustomer(identifier: string, password: string) {
  return (
    identifier.trim().toLocaleLowerCase('tr-TR') === MOCK_CUSTOMER_CREDENTIALS.identifier &&
    password.trim() === MOCK_CUSTOMER_CREDENTIALS.password
  );
}

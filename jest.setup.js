import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret-key'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-google-client-id'
process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID = 'test-facebook-client-id'

// Global test utilities
global.console = {
    ...console,
    // Suppress specific console messages during tests
    error: jest.fn(),
    warn: jest.fn(),
}

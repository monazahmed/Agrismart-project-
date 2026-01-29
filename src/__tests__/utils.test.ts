/**
 * Utility function tests
 */

function addNumbers(a: number, b: number): number {
    return a + b
}

function subtractNumbers(a: number, b: number): number {
    return a - b
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function formatCurrency(amount: number, currency = 'BDT'): string {
    return `${currency} ${amount.toLocaleString()}`
}

describe('Utility Functions', () => {
    describe('addNumbers', () => {
        test('should add two positive numbers', () => {
            expect(addNumbers(5, 3)).toBe(8)
        })

        test('should add positive and negative numbers', () => {
            expect(addNumbers(5, -3)).toBe(2)
        })

        test('should handle zero', () => {
            expect(addNumbers(0, 5)).toBe(5)
        })
    })

    describe('subtractNumbers', () => {
        test('should subtract two positive numbers', () => {
            expect(subtractNumbers(10, 3)).toBe(7)
        })

        test('should handle negative results', () => {
            expect(subtractNumbers(3, 10)).toBe(-7)
        })
    })

    describe('validateEmail', () => {
        test('should validate correct email format', () => {
            expect(validateEmail('test@example.com')).toBe(true)
            expect(validateEmail('farmer@agrismart.com')).toBe(true)
        })

        test('should reject invalid email format', () => {
            expect(validateEmail('invalid-email')).toBe(false)
            expect(validateEmail('test@')).toBe(false)
            expect(validateEmail('@example.com')).toBe(false)
        })

        test('should reject empty email', () => {
            expect(validateEmail('')).toBe(false)
        })
    })

    describe('formatCurrency', () => {
        test('should format currency with default BDT', () => {
            expect(formatCurrency(1000)).toBe('BDT 1,000')
            expect(formatCurrency(10000)).toBe('BDT 10,000')
        })

        test('should format currency with custom currency', () => {
            expect(formatCurrency(1000, 'USD')).toBe('USD 1,000')
            expect(formatCurrency(1000, 'INR')).toBe('INR 1,000')
        })
    })
})

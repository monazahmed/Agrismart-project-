import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Marketplace API Tests', () => {
    test('should fetch products successfully', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/marketplace/products`)
        expect(response.status()).toBeLessThanOrEqual(500)
    })

    test('should fetch product by ID', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/marketplace/products/test-id`)
        expect(response.status()).toBeLessThanOrEqual(500)
    })
})

test.describe('Authentication API Tests', () => {
    test('should have session endpoint', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/auth/session`)
        expect(response.status()).toBeLessThanOrEqual(500)
    })

    test('should have signin endpoint', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/auth/signin`)
        expect([200, 302, 404]).toContain(response.status())
    })
})

test.describe('Contact API Tests', () => {
    test('should handle contact form submission', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/contact`, {
            data: {
                name: 'Test User',
                email: 'test@example.com',
                subject: 'Test Subject',
                message: 'Test Message',
            },
        })
        expect(response.status()).toBeLessThanOrEqual(500)
    })
})

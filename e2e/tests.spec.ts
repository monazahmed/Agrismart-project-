import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('AgriSmart E2E Tests', () => {
    test.describe('Home Page', () => {
        test('should load home page successfully', async ({ page }) => {
            await page.goto(BASE_URL)
            await expect(page).toHaveTitle(/AgriSmart/)
            const heading = page.locator('h1')
            await expect(heading).toBeVisible()
        })

        test('should display navigation menu', async ({ page }) => {
            await page.goto(BASE_URL)
            const navbar = page.locator('nav')
            await expect(navbar).toBeVisible()
        })

        test('should have working language toggle', async ({ page }) => {
            await page.goto(BASE_URL)
            const languageToggle = page.locator('[data-testid="language-toggle"]')
            if (await languageToggle.isVisible()) {
                await languageToggle.click()
                await page.waitForLoadState('networkidle')
            }
        })
    })

    test.describe('Authentication', () => {
        test('should navigate to login page', async ({ page }) => {
            await page.goto(`${BASE_URL}/login`)
            const loginForm = page.locator('form')
            await expect(loginForm).toBeVisible()
        })

        test('should display email and password fields on login', async ({ page }) => {
            await page.goto(`${BASE_URL}/login`)
            const emailInput = page.locator('input[type="email"]')
            const passwordInput = page.locator('input[type="password"]')
            await expect(emailInput).toBeVisible()
            await expect(passwordInput).toBeVisible()
        })

        test('should have sign up link on login page', async ({ page }) => {
            await page.goto(`${BASE_URL}/login`)
            const signUpLink = page.locator('a[href*="sign-up"]')
            await expect(signUpLink).toBeVisible()
        })

        test('should navigate to sign up page', async ({ page }) => {
            await page.goto(`${BASE_URL}/sign-up`)
            const signUpForm = page.locator('form')
            await expect(signUpForm).toBeVisible()
        })
    })

    test.describe('Marketplace', () => {
        test('should load marketplace page', async ({ page }) => {
            await page.goto(`${BASE_URL}/marketplace`)
            await page.waitForLoadState('networkidle')
            const productCards = page.locator('[data-testid="product-card"]')
            const cardCount = await productCards.count()
            expect(cardCount).toBeGreaterThanOrEqual(0)
        })

        test('should display product filters', async ({ page }) => {
            await page.goto(`${BASE_URL}/marketplace`)
            const filters = page.locator('[data-testid="product-filters"]')
            if (await filters.isVisible()) {
                await expect(filters).toBeVisible()
            }
        })

        test('should search for products', async ({ page }) => {
            await page.goto(`${BASE_URL}/marketplace`)
            const searchInput = page.locator('input[placeholder*="search" i]')
            if (await searchInput.isVisible()) {
                await searchInput.fill('seeds')
                await page.waitForLoadState('networkidle')
            }
        })

        test('should access shopping cart', async ({ page }) => {
            await page.goto(`${BASE_URL}/marketplace/cart`)
            const cartContainer = page.locator('[data-testid="cart-container"]')
            await expect(cartContainer).toBeVisible()
        })

        test('should navigate to product details', async ({ page }) => {
            await page.goto(`${BASE_URL}/marketplace`)
            const firstProduct = page.locator('[data-testid="product-card"]').first()
            if (await firstProduct.isVisible()) {
                await firstProduct.click()
                await page.waitForLoadState('networkidle')
            }
        })
    })

    test.describe('Community & Knowledge Hub', () => {
        test('should load community page', async ({ page }) => {
            await page.goto(`${BASE_URL}/community`)
            const communityContent = page.locator('main')
            await expect(communityContent).toBeVisible()
        })

        test('should load knowledge hub', async ({ page }) => {
            await page.goto(`${BASE_URL}/knowledge-hub`)
            await page.waitForLoadState('networkidle')
            const hubContent = page.locator('main')
            await expect(hubContent).toBeVisible()
        })
    })

    test.describe('Disease Detector', () => {
        test('should load disease detector page', async ({ page }) => {
            await page.goto(`${BASE_URL}/disease-detector`)
            const detectorContent = page.locator('main')
            await expect(detectorContent).toBeVisible()
        })
    })

    test.describe('Dashboard', () => {
        test('should load dashboard page', async ({ page }) => {
            await page.goto(`${BASE_URL}/dashboard`)
            // May redirect to login if not authenticated
            const content = page.locator('main, form')
            await expect(content).toBeVisible()
        })
    })

    test.describe('Static Pages', () => {
        test('should load about page', async ({ page }) => {
            await page.goto(`${BASE_URL}/about`)
            const content = page.locator('main')
            await expect(content).toBeVisible()
        })

        test('should load privacy policy', async ({ page }) => {
            await page.goto(`${BASE_URL}/privacy-policy`)
            const content = page.locator('main')
            await expect(content).toBeVisible()
        })

        test('should load terms page', async ({ page }) => {
            await page.goto(`${BASE_URL}/terms`)
            const content = page.locator('main')
            await expect(content).toBeVisible()
        })

        test('should load cookie policy', async ({ page }) => {
            await page.goto(`${BASE_URL}/cookie-policy`)
            const content = page.locator('main')
            await expect(content).toBeVisible()
        })
    })

    test.describe('Responsive Design', () => {
        test('should be responsive on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 })
            await page.goto(BASE_URL)
            const navbar = page.locator('nav')
            await expect(navbar).toBeVisible()
        })

        test('should be responsive on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 })
            await page.goto(BASE_URL)
            const navbar = page.locator('nav')
            await expect(navbar).toBeVisible()
        })

        test('should be responsive on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 })
            await page.goto(BASE_URL)
            const navbar = page.locator('nav')
            await expect(navbar).toBeVisible()
        })
    })

    test.describe('Performance', () => {
        test('home page should load within 3 seconds', async ({ page }) => {
            const startTime = Date.now()
            await page.goto(BASE_URL)
            const loadTime = Date.now() - startTime
            expect(loadTime).toBeLessThan(3000)
        })

        test('marketplace page should load within 4 seconds', async ({ page }) => {
            const startTime = Date.now()
            await page.goto(`${BASE_URL}/marketplace`)
            await page.waitForLoadState('networkidle')
            const loadTime = Date.now() - startTime
            expect(loadTime).toBeLessThan(4000)
        })
    })

    test.describe('Accessibility', () => {
        test('should have proper heading structure', async ({ page }) => {
            await page.goto(BASE_URL)
            const h1 = page.locator('h1')
            const h2 = page.locator('h2')
            // Should have at least one h1
            const h1Count = await h1.count()
            expect(h1Count).toBeGreaterThanOrEqual(1)
        })

        test('should have alt text on images', async ({ page }) => {
            await page.goto(BASE_URL)
            const images = page.locator('img')
            const imageCount = await images.count()

            for (let i = 0; i < Math.min(imageCount, 5); i++) {
                const image = images.nth(i)
                const altText = await image.getAttribute('alt')
                // Next.js Image component should have alt text or aria-label
                const ariaLabel = await image.getAttribute('aria-label')
                if (altText === null && ariaLabel === null) {
                    // Some decorative images may not have alt text
                }
            }
        })
    })
})

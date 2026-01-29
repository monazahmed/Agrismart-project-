import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock component for testing
const MockButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
)

describe('Button Component Tests', () => {
    test('renders button with label', () => {
        const handleClick = jest.fn()
        render(<MockButton label="Click me" onClick={handleClick} />)

        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
    })

    test('button click handler is called', () => {
        const handleClick = jest.fn()
        render(<MockButton label="Click me" onClick={handleClick} />)

        const button = screen.getByRole('button', { name: /click me/i })
        button.click()

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('button is visible and enabled', () => {
        const handleClick = jest.fn()
        render(<MockButton label="Click me" onClick={handleClick} />)

        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeVisible()
        expect(button).toBeEnabled()
    })
})

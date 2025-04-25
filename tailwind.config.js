/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
            },
        },
        extend: {
            colors: {
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'accent': 'var(--accent)',
                'footer-bg': 'var(--footer-bg)',
            },
            spacing: {
                'header': 'var(--header-height)',
            },
            maxWidth: {
                'container': 'var(--container-max-width)',
                'content': 'var(--content-max-width)',
            },
            opacity: {
                '5': '0.05',
                '10': '0.1',
                '20': '0.2',
                '30': '0.3',
                '40': '0.4',
                '60': '0.6',
                '70': '0.7',
                '80': '0.8',
                '90': '0.9',
                '95': '0.95',
            }
        },
    },
    plugins: [],
    safelist: [
        {
            pattern: /bg-(accent|gray|blue|yellow|green|red|purple)-(500|600|700|800|900)/,
            variants: ['hover']
        },
        {
            pattern: /bg-(accent|gray|blue|yellow|green|red|purple)/,
            variants: ['hover'],
        }
    ]
}
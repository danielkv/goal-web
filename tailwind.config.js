/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            gray: {
                100: '#101010',
                300: '#202020',
                500: '#262626',
                600: '#323232',
                700: '#999999',
                900: '#cccccc',
            },
            red: {
                100: '#FFC7D0',
                300: '#FD647D',
                500: '#EE2042',
                700: '#AC162F',
                900: '#680D1C',
            },
            black: '#000000',
            white: '#ffffff',
        },

        extend: {
            width: {
                a4: '210mm',
            },
            height: {
                a4: '297mm',
            },
        },
    },
    variants: {
        fontSize: ({ after }) => after(['em']),
    },
    plugins: [
        require('tailwindcss/plugin')(function ({ addVariant }) {
            addVariant('em', ({ container }) => {
                container.walkRules((rule) => {
                    rule.selector = `.em\\:${rule.selector.slice(1)}`
                    rule.walkDecls((decl) => {
                        decl.value = decl.value.replace('rem', 'em')
                    })
                })
            })
        }),
    ],
}

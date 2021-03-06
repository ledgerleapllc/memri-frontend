const plugin = require('tailwindcss/plugin')

const paddingCard = '2.1875rem';

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
      },
    },
    extend: {
      fontSize: {
        xxs: '0.625rem'
      },
      width: {
        '500px': '500px',
        '250px': '250px',
        '7/10': '70%',
        'fit': 'fit-content'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      colors: {
        primary: '#FB5824',
        secondary: '#2FBFA4',
        green1: '#5DD0BA',
        red: '#EA5454',
        blue: '#515DFA',
        gray1: '#646464',
        gray2: '#9B9B9B',
        gray3: '#E3E3E3',
        white1: '#F4F7F6',
        dark: '#202020',
        dark1: '#130427',
        success: '#2FBFA4',
        danger: 'rgb(232, 85, 88)',
      },
      padding: {
        '12.5': '3.125rem',
        'card': paddingCard,
        'tracker': `calc(${paddingCard} - 7px)`,
      },
      margin: {
        '-card': `-${paddingCard}`,
      },
      height: {
        'tab' : 'calc(100% + 2.5rem)',
        'm-content': 'min-content',
        'fit': 'fit-content',
        '128': '32rem'
      },
      maxHeight: {
        card: '1000px',
        '160': '40rem'
      }
    },
  },
  variants: {
    extend: {
      height: ['important'],
      width: ['important'],
      maxWidth: ['important'],
      maxHeight: ['important'],
      borderRadius: ['important'],
      padding: ['important'],
      backgroundColor: ['important'],
      backgroundOpacity: ['important'],
      flex: ['important'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    plugin(function({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      })
    })
  ],
}
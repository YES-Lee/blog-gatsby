export function switchTheme (theme = 'light') {
  const themes = {
    light: {
      '--color-font': '#2f3640',
      '--color-background': '#f6f6f6',
      '--color-foreground': '#fff',
      '--color-border': '#dcdde1'
    },
    dark: {
      '--color-font': '#fff',
      '--color-background': '#121212',
      '--color-foreground': 'rgba(255,255,255,0.05)',
      '--color-border': '#121212'
    }
  }
  const colors = themes[theme.toLowerCase()]
  if (colors) {
    Object.keys(colors).forEach(k => {
      window.document.documentElement.style.setProperty(k, colors[k])
    })
  }
}

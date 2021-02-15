import axios from 'axios'

let backgroundImage

export async function switchTheme(theme = 'light') {
  const themes = {
    light: {
      '--color-font': '#404040',
      '--color-background': '#f6f6f6',
      '--color-foreground': '#fff',
      '--color-border': '#dcdde1',
    },
    dark: {
      '--color-font': '#fff',
      '--color-background': '#121212',
      '--background-image': 'none',
      // '--color-foreground': 'rgba(255,255,255,0.05)',
      '--color-foreground': 'rgb(30,30,30)',
      // '--color-border': '#121212'
    },
  }
  if (theme === 'light' && !backgroundImage) {
    try {
      const result = await axios.get(
        'https://api.66mz8.com/api/bg.img.php?format=json'
      )
      backgroundImage = result.data.pic_url
    } catch (err) {
      console.error(err)
    }
  }
  themes.light['--background-image'] = `url(${backgroundImage})`
  const colors = themes[theme.toLowerCase()]
  if (colors) {
    Object.keys(colors).forEach(k => {
      window.document.documentElement.style.setProperty(k, colors[k])
    })
  }
}

/**
 * 处理文章html
 * @param {string} html HTML字符串
 */
export function postHtmlFilter(html = '') {
  const tableReg = /<table[\s\S]*<\/table>/gi
  const result = html.replace(tableReg, match => {
    return `<div class="table-wrapper">${match}</div>`
  })
  return result
}

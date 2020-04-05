const path = require('path')
const fs = require('fs')

exports.onPostBuild = async ({ graphql }, options) => {
  const domain = options.domain || '/'
  const result = await graphql(`
    {
      allSitePage {
        nodes {
          id
          path
        }
      }
    }
  `)
  const pageList = result.data.allSitePage.nodes
  const urls = pageList.map(item => {
    return path.join(domain.replace(/\/+?$/, ''), item.path)
  })
  fs.writeFileSync(path.resolve(process.cwd(), 'public/urls.txt'), urls.join('\n'), { encoding: 'utf8' })
}

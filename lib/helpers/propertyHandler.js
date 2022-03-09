const tools = require('./tools')

function colorHandler(svgjson, color='000') {
  let tmpcolor = `#${color}`
  if (!svgjson[0].attributes['style']) svgjson[0].attributes['style'] = ''
  svgjson[0].attributes['style'] += ` background-color: ${tmpcolor==`#000` ? `#fff` : '#000'};`
  svgjson = setupclasstag(svgjson, {'.customColor': [["fill",tmpcolor]]})
  return svgjson
}

function sizeHandler(svgjson, size) {
  if (!svgjson[0].attributes['width']) svgjson[0].attributes['width'] = ''
  svgjson[0].attributes['width'] = size
  if (!svgjson[0].attributes['height']) svgjson[0].attributes['height'] = ''
  svgjson[0].attributes['height'] = size
  if (size != '1500') svgjson = setupclasstag(svgjson, {'.customFontsize': [["font-size",`${size}px`]]})
  return svgjson
}

function setupclasstag(svgjson, styles) {
  const stylesearch = tools.lookupTag(svgjson, 'style')
  if (stylesearch.length) {
    Object.entries(styles).forEach(style => {
      if (!svgjson[stylesearch[0].index].style[style[0]]) svgjson[stylesearch[0].index].style[style[0]] = []
      style[1].forEach(newstyle => {svgjson[stylesearch[0].index].style[style[0]].push(newstyle)})
    })
  } else {
    const defssearch = tools.lookupTag(svgjson, 'defs')
    if (!defssearch.length) {
      svgjson.splice(1, 0, {tag: "defs",attributes: {},attrLess: undefined,content: null,opening: true})
      svgjson.splice(2, 0, {tag: "style",style: styles,opening: true})
      svgjson.splice(3, 0, {tag: "/style",opening: false})
      svgjson.splice(4, 0, {tag: "/defs",opening: false})
    }
  }
  const pathsearch = tools.lookupTag(svgjson, 'path')
  pathsearch.forEach(path => {
    Object.entries(styles).forEach(style => {
      if (!svgjson[path.index].attributes.class) svgjson[path.index].attributes.class = ''
      svgjson[path.index].attributes.class += svgjson[path.index].attributes.class.length ? ` ${style[0].replaceAll('.', '')}` : style[0].replaceAll('.', '')
    })
  })
  return svgjson
}

module.exports = {
  colorHandler,
  sizeHandler,
}

const parseJson = require('./parseJson');

function parsePath(data, {unifySvg}) {
  console.info('convertAllToPath');
  if(!data || data.length==0) throw 'invalid input in convertAllToPath'
  // skip the process if the unifySvg is false
  if(!unifySvg) return data;

  // convert the string data to json
  return parseJson.async(data)
  // You can convert all specific svg tags such as rect or poligon and etc to PATH tag
  .then(data => data.map(tagData => {
    if (tagData.attributes && tagData.attributes.d) {
      const attrs = tagData.attributes;
      tagData.attributes = {};
      tagData.attributes['d'] = assign(tagData.tag, attrs)
      tagData.tag = 'path'
      tagData.attributes = { ...attrs, class: attrs && attrs.class || null, id: attrs && attrs.id || null }
    }
    return tagData;
  }));
}

function assign(tag, attrs) {
  switch(tag) {
    case 'rect': return svgTo.rectToPath(attrs);
    case 'polyline': return svgTo.polylineToPath(attrs);
    case 'line': return svgTo.lineToPath(attrs);
    case 'circle': return svgTo.circleToPath(attrs);
    case 'polygon': return svgTo.polygonToPath(attrs);
    default: return attrs;
  }
}
 
class svgTo {
  static rectToPath(attributes) {
    if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathRectToPath'
    const x = 'undefined' !== typeof attributes.x ? parseFloat(attributes.x) : 0;
    const y = 'undefined' !== typeof attributes.y ? parseFloat(attributes.y) : 0;
    const width =
      'undefined' !== typeof attributes.width ? parseFloat(attributes.width) : 0;
    const height =
      'undefined' !== typeof attributes.height
        ? parseFloat(attributes.height)
        : 0;
    const rx =
      'undefined' !== typeof attributes.rx
        ? parseFloat(attributes.rx)
        : 'undefined' !== typeof attributes.ry
        ? parseFloat(attributes.ry)
        : 0;
    const ry =
      'undefined' !== typeof attributes.ry ? parseFloat(attributes.ry) : rx;

    return (
      '' +
      // start at the left corner
      'M' +
      (x + rx) +
      ' ' +
      y +
      // top line
      'h' +
      (width - rx * 2) +
      // upper right corner
      (rx || ry ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry : '') +
      // Draw right side
      'v' +
      (height - ry * 2) +
      // Draw bottom right corner
      (rx || ry ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx * -1 + ' ' + ry : '') +
      // Down the down side
      'h' +
      (width - rx * 2) * -1 +
      // Draw bottom right corner
      (rx || ry
        ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx * -1 + ' ' + ry * -1
        : '') +
      // Down the left side
      'v' +
      (height - ry * 2) * -1 +
      // Draw bottom right corner
      (rx || ry ? 'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry * -1 : '') +
      // Close path
      'z'
    );
  }
  
  
  static polylineToPath(attributes) {
    if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathPolylineToPath'
    return 'M' + attributes.points;
  }
    
  static lineToPath(attributes) {
    if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathLineToPath'
    // Move to the line start
    return (
      '' +
      'M' +
      (parseFloat(attributes.x1) || 0).toString(10) +
      ' ' +
      (parseFloat(attributes.y1) || 0).toString(10) +
      ' ' +
      ((parseFloat(attributes.x1) || 0) + 1).toString(10) +
      ' ' +
      ((parseFloat(attributes.y1) || 0) + 1).toString(10) +
      ' ' +
      ((parseFloat(attributes.x2) || 0) + 1).toString(10) +
      ' ' +
      ((parseFloat(attributes.y2) || 0) + 1).toString(10) +
      ' ' +
      (parseFloat(attributes.x2) || 0).toString(10) +
      ' ' +
      (parseFloat(attributes.y2) || 0).toString(10) +
      'Z'
    );
  }
    
  static circleToPath(attributes) {
    if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathCircleToPath'
    const cx = parseFloat(attributes.cx);
    const cy = parseFloat(attributes.cy);
    const rx =
      'undefined' !== typeof attributes.rx
        ? parseFloat(attributes.rx)
        : parseFloat(attributes.r);
    const ry =
      'undefined' !== typeof attributes.ry
        ? parseFloat(attributes.ry)
        : parseFloat(attributes.r);

    // use two A commands because one command which returns to origin is invalid
    return (
      '' +
      'M' +
      (cx - rx) +
      ',' +
      cy +
      'A' +
      rx +
      ',' +
      ry +
      ' 0,0,0 ' +
      (cx + rx) +
      ',' +
      cy +
      'A' +
      rx +
      ',' +
      ry +
      ' 0,0,0 ' +
      (cx - rx) +
      ',' +
      cy
    );
  }
    
  static polygonToPath(attributes) {
    if(!attributes || attributes.length==0) throw 'no attribute sent to svgShapesToPathPolygonToPath'
    return 'M' + attributes.points + 'Z';
  }
}

module.exports = parsePath;
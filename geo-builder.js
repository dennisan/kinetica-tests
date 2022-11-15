// Run with: node kdb-test.js filepath

const geo = require('./makeGeometry.js')

// see args below for usage
const {
    format='json',
    x=-101, y=32,
    cx=1, cy=1,
    dx=1, dy=1,
    sides=4,
    vertices=10,
    radius=.25,
    smoothness=0.15
} = require('args-parser')(process.argv);

let geometry = geo.makeMultiPolygon(x, y, cx, cy, dx, dy, sides, vertices, radius, smoothness)
let output = ''

switch (format) {
    case 'wkt':
        output = geo.multiToWKT(geometry)
        break

    default:
    case 'json':
    case 'geojson':
        json = geo.multiToGeoJson(geometry)
        output = JSON.stringify(json, null ,2)
        break
}

// console.info(`Geometry x:${x}, y:${y}, cx:${cx}, cy:${cy}, dx:${dx}, dy:${dy}, sides:${sides}, vertices:${vertices}, radius:${radius}, smoothness: ${smoothness}\n`)
console.log(output);

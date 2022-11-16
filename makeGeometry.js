const { exit } = require("process")

// Convert degrees to radians
const toRads = (degrees) => degrees * Math.PI /180

// Get a random number between n and 3n
const randSpread = (spread) => Math.random() * (2 * spread) + spread

// Create a star-shaped polygon centered a x,y with the specified number of vertices
// use sides to control the rough shape of the polygon
// use radius and smoothness to control the length and variability of each line segment
const makePolygon = function(x, y, sides=4, vertices, radius, smoothness=0) {
    verts = []
    const delta = 360 / vertices  // angle between vertices
    const subangle = 360 / sides  // angle between corners

    for (v = 0; v < vertices; v++) {
        const d = delta * v
        const z = Math.abs((d % subangle / subangle) - 0.5) + 1
        const h = (radius / z) + randSpread(radius*smoothness )  // vary the radius
        const dy = h * Math.sin(toRads(d))
        const dx = h * Math.cos(toRads(d))
        verts.push({ x: x + dx, y: y + dy})
    }
    verts.push(verts[0])

    return verts
}

// Create a (cx,cy) sized matrix of polygons centered at x,y with distance dx,dy between each polygon
const makeMultiPolygon = function(x, y, cx, cy, dx, dy, sides, vertices, radius, smoothness=0) {
    polys = []

    for (i = 0; i < cx; i++) {
        for (j = 0; j < cy; j++) {
            const poly = makePolygon(x + dx * i, y + dy * j, sides, vertices, radius, smoothness)
            polys.push(poly)
        }
    }

    return polys
}

const transform_response = function(result) {
    table = []
    result.column_1.forEach((id, i) => {
        row = {}
        result.column_headers.forEach((col, j) => {
            row[col] = result['column_'+(j+1)][i]
        })
        table.push(row)
    })
    return table
}

const polyToCords = (verts) => verts.map(v => `[${v.x}, ${v.y}]`).join(',\n')
const multiToCords = (polys) => polys.map(p => `[${polyToCords(p)}]`).join(',\n')

const polyToWKT = (verts) => '((' + verts.map(v => `${v.x} ${v.y}`).join(',') + '))'
const multiToWKT = (polys) => 'MULTIPOLYGON(' + polys.map(p => polyToWKT(p)).join(',') + ')'
const multiToGeoJson = (polys) => (
    {
        type: "Feature",
        properties: {},
        geometry: {
            type: "MultiPolygon",
            coordinates: [
                polys.map(poly =>
                    poly.map(vert => [vert.x, vert.y])
                )
            ]
        }
    }
)



module.exports = {makePolygon, makeMultiPolygon, polyToCords, multiToCords, polyToWKT, multiToWKT, multiToGeoJson, transform_response}
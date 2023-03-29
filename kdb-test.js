// Usage:
//   node kdb-test.js [options]
//      options:
//          host,                       // ip addressand port of the gpudb host (default = 10.48.17.68:9191)
//          showGeometry,               // true to output wkt to console (default = false)
//          showDetailedResults,        // true to include individual test results in output (default = false)
//          cycles = 1,                 // number of test cycles to execute (default = 1)
//          x = -101, y = 32,           // x,y center of polygon (default x = -101, y = 32)
//          cx=1, cy=1,                 // count of polygons in x,y matrix (default x = 1, y = 1)
//          dx=1, dy=1,                 // distance x,y between polygons (default x = 1, y = 1)
//          sides=4,                    // number of sides on polygon (default = 4)
//          vertices=10,                // number of vertices on polygon (default = 10)
//          radius=.25,                 // polygon radius (default = .25)
//          smoothness=0.15             // polygon smoothness (default = .15)

const GPUdb = require("./GPUdb.js");
const geo = require('./makeGeometry.js')
const { exit } = require("process");

var username = process.env['KDB_USER']
var password = process.env['KDB_PASS']

// see args below for usage
const {
    host='10.48.17.68:9191',            // gpudb host (Required)
    dataset='prism.pipeline_view',      // table to filter
    column='WKT',                       // column in table that contains geometry
    operation='ST_INTERSECTS',          // operation to perform
    showGeometry=false,                 // output wkt to console
    showDetailedResults=false,          // include individual test results in output
    cycles = 1,                         // number of test cycles to execute
    x = -101, y = 32,                   // x,y center of polygon
    cx=1, cy=1,                         // count of polygons in x,y matrix
    dx=1, dy=1,                         // distance x,y between polygons
    sides=4,                            // number of sides on polygon
    vertices=10,                        // number of vertices on polygon
    radius=.25,                         // polygon radius
    smoothness=0.15                     // polygon smoothness
} = require('args-parser')(process.argv)

const runTest = (dataset, column, operation, cycles, x, y, cx, cy, dx, dy, sides, vertices, radius, smoothness) => {

    let geometry = null

    // create geometry and setup query
    geometry = geo.multiToWKT(geo.makeMultiPolygon(x, y, cx, cy, dx, dy, sides, vertices, radius, smoothness))

    const expression = `${operation}('${geometry}', ${column})`
    const dataset_name = dataset

    if (showGeometry) {
        console.log(`Polygons:${cx *cy}, vertices: ${vertices}, radius: ${radius}, smoothness: ${smoothness}\n`);
        console.log(`\n\n${geometry}\n\n`);
    }

    // connect to kinetica
    var gpudb = new GPUdb( `http://${host}`, {username, password} );

    // run the tests
    result = [...Array(cycles).keys()].map(i =>
        gpudb.filter( dataset_name, null /* view_name */, expression, null /* foptions */)
    )

    // capture the results
    Promise.all(result)
    .then((results)=>{
        const avgRespTime = (results.reduce ((p,c)=> p + c.request_time_secs, 0) / results.length).toFixed(4)
        const cntRecords = (results.reduce ((p,c)=> p + c.count, 0) / results.length)
        const minRespTime = results.reduce ((p,c) => Math.min(p, c.request_time_secs), 1000).toFixed(4)
        const maxRespTime = results.reduce ((p,c) => Math.max(p, c.request_time_secs), 0).toFixed(4)

        if (showDetailedResults) {
            results.forEach(r => console.log(`Found ${r.count} records in ${r.request_time_secs} sec `))
        }
        console.log(`host: ${host}, table: ${dataset_name}, operation: ${operation}, polygons: ${cx*cy} (${cx}x${cy}), dx: ${dx}, dy: ${dy}, vertices: ${vertices}, radius: ${radius}, records found: ${cntRecords}, cycles: ${results.length}, min: ${minRespTime}s, avg:${avgRespTime}s, max:${maxRespTime}s` );
    })
    .catch((error)=> {
        console.error(error );
        console.log(`host: ${host}, polygons: ${cx*cy} (${cx}x${cy}), vertices: ${vertices}, JOB CANCELED` );
        exit(1)
    })
}

runTest(dataset, column, operation, cycles, x, y, cx, cy, dx, dy, sides, vertices, radius, smoothness)

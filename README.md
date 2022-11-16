# kdb-test
## Description
Creates a complex MULTIPOLYGON as described by the options below then performs a series of ST_INTERSECTS operations with that geometry against the prism.pipeline_view dataset and reports the timing of the operation

## Usage:

node kdb-test.js [options]

**Options**:\
Use these options to describe the geometry used to filter the dataset

- **host**: ip addressand port of the gpudb host (default = 10.48.17.68:9191)
- **showGeometry**: true to output wkt to console (default = false)
- **showDetailedResults**: true to include individual test results in output (default = false)
- **cycles**: number of test cycles to execute in the series (default = 1)
- **x**,y: center of polygon (default x = -101, y = 32)
- **cx**, cy: count of polygons in x,y matrix (default x = 1, y = 1)
- **dx**, dy: distance x,y between polygons (default x = 1, y = 1)
- **sides**: number of sides on polygon (default = 4)
- **vertices**: number of vertices on polygon (default = 10)
- **radius**: polygon radius (default = .25)
- **smoothness**: polygon smoothness (default = .15)

## Examples

#### Example 1
- node ./kdb-test.js

#### Result
- host: 10.48.17.68:9191, table: prism.pipeline_view, operation: ST_INTERSECTS, polygons: 1 (1x1), vertices: 10, records: 717, cycles: 1, min: 0.0566s, avg:0.0566s, max:0.0566s

#### Example 2
- node ./kdb-test.js cx=4 cy=4 vertices=100 radius=.25

#### Result
- host: 10.48.17.68:9191, table: prism.pipeline_view, operation: ST_INTERSECTS, polygons: 16 (4x4), vertices: 100, records: 11002, cycles: 1, min: 12.2006s, avg:12.2006s, max:12.2006s

#### Example 3
- node ./kdb-test.js cx=4 cy=4 dx=10 dy=10 vertices=100 radius=.5

#### Result
- host: 10.48.17.68:9191, table: prism.pipeline_view, operation: ST_INTERSECTS, polygons: 16 (4x4), vertices: 100, records: 6764, cycles: 1, min: 70.4833s, avg:70.4833s, max:70.4833s

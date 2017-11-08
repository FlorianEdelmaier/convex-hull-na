'use strict';
const dms2dec = require('dms2dec');
const calculateConvexHull = require('geo-convex-hull');
const turf = require('turf-area');

const formatLatLon = (input) => {
    const coordsStrArray = input.slice(0,-1).replace('"', '').replace("'", ',').replace('°', ',').split(',');
    const coordsArray = [parseInt(coordsStrArray[0]), parseInt(coordsStrArray[1]), parseFloat(coordsStrArray[2])];
    const hemisphere = input.substring(input.length - 1, input.length);
    return [coordsArray, hemisphere];
}

const convert2Dec = (lat, lon) => {
    const latForm = formatLatLon(lat);
    const lonForm = formatLatLon(lon);
    const decimalPoint = dms2dec(latForm[0], latForm[1], lonForm[0], lonForm[1]);
    return { latitude: decimalPoint[0], longitude: decimalPoint[1] };
}

const calculateConvexHullFromPoints = (points) => {
    const result = [];
    const hull = calculateConvexHull(points);
    hull.map(e => {
        result.push([e.latitude, e.longitude]);
    });
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [result]
                }
            }
        ]
    }
}

const calculateArea = (polygon) => {
    return turf(polygon);
}

module.exports = {
    formatLatLon,
    convert2Dec,
    calculateConvexHullFromPoints,
    calculateArea
}
'use strict';
const {loadData} = require('./data');
const {formatLatLon, convert2Dec, calculateConvexHullFromPoints, calculateArea} = require('./geo');
const fs = require('fs');
const csv = require('fast-csv');
const csvStream = csv.createWriteStream({headers: ['na', 'area']});
const writableStream = fs.createWriteStream('output.csv');

writableStream.on("finish", () => console.log("done"));
csvStream.pipe(writableStream);

const main = async() => {
    const result = await loadData();
    const distinctNAs = [];
    result.map(el => {
        if(distinctNAs.indexOf(el.nName) < 0) distinctNAs.push(el.nName);
    })
    let areaString = '';
    distinctNAs.forEach(na => {
        const points = [];
        const pPoints = result.filter(e => e.nName === na);
        pPoints.map(e => {
            points.push(convert2Dec(e.pLat, e.pLon));
        });
        const hull = calculateConvexHullFromPoints(points);
        const area = calculateArea(hull);
        csvStream.write({ "na": na, "area": area });
    });
    csvStream.end();
    //process.exit(1);
}

main();
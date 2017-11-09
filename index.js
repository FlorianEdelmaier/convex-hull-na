'use strict';
const {loadData} = require('./data');
const {formatLatLon, convert2Dec, calculateConvexHullFromPoints, calculateArea} = require('./geo');
const fs = require('fs');
const csv = require('fast-csv');
const csvStream = csv.createWriteStream({headers: ['na', 'area', 'cntP', 'cntPwithCoords']});
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
        const cntP = result.filter(e => e.nName === na);
        const pPoints = result.filter(e => e.nName === na && e.pLat && e.pLat !== null && e.pLon && e.pLon !== null);
        pPoints.map(e => {
            points.push(convert2Dec(e.pLat, e.pLon));
        });
        let hull = 0;
        let area = 0;
        if(points.length > 0) {
            hull = calculateConvexHullFromPoints(points);
            area = calculateArea(hull);
        }
        csvStream.write({ "na": na, "area": area, "cntP": cntP.length, "cntPwithCoords": pPoints.length });
    });
    csvStream.end();
    //process.exit(1);
}

main();
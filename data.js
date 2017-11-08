const sql = require('mssql');
const config = require('./config');

const loadData = async() => {
   try {
       const pool = await sql.connect(config.sql);
       const result = await sql.query`
       SELECT * FROM 
       (
       SELECT
       ob.OrgEntityBaseID AS [pid],
       ob.Code AS [pCode],
       ob.ShortName AS [pName],
       naob.OrgEntityBaseID AS [nid],
       naob.Code AS [nCode],
       naob.Shortname AS [nName],
       rob.ShortName AS [rName],
       (
           SELECT TOP 1 Latitude
           FROM LucyApp.ProgrammeUnit AS pu
           INNER JOIN LucyApp.RunningCostsUnit AS purcu ON purcu.RunningCostsUnitID = pu.ProgrammeUnitID
           INNER JOIN LucyApp.OrgUnit AS puou ON puou.OrgUnitID = pu.ProgrammeUnitID
           WHERE purcu.UnitSubTypeID = '3D9AABE9-A44F-4C4E-99FB-5E2860073D3F' AND pu.ProgrammeID = ob.OrgEntityBaseID
       ) AS [pLat],
       (
           SELECT TOP 1 Longitude
           FROM LucyApp.ProgrammeUnit AS pu
           INNER JOIN LucyApp.RunningCostsUnit AS purcu ON purcu.RunningCostsUnitID = pu.ProgrammeUnitID
           INNER JOIN LucyApp.OrgUnit AS puou ON puou.OrgUnitID = pu.ProgrammeUnitID
           WHERE purcu.UnitSubTypeID = '3D9AABE9-A44F-4C4E-99FB-5E2860073D3F' AND pu.ProgrammeID = ob.OrgEntityBaseID
       ) AS [pLon]
       FROM LucyApp.Programme AS p
       INNER JOIN LucyApp.OrgEntityBase AS ob ON ob.OrgEntityBaseID = p.ProgrammeID
       INNER JOIN  LucyApp.OrgEntityBase AS naob ON p.NationalAssociationID = naob.OrgEntityBaseID
       INNER JOIN LucyApp.NationalAssociation AS na ON na.NationalAssociationID = naob.OrgEntityBaseID
       INNER JOIN Lucyapp.OrgEntityBase AS rob ON rob.OrgEntityBaseID = na.SOSRegionID
       WHERE p.IsInactive = 0
       ) tmp WHERE pLat IS NOT NULL AND pLon IS NOT NULL AND rName <> 'EUNA'
       `
       return result.recordset;
   } catch (err) {
       console.log(err);
       return [];
   }
}

module.exports.loadData = loadData;
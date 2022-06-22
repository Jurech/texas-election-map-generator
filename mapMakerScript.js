const fs = require("fs");
const xml2js = require('xml2js');

const myArgs = process.argv.slice(2);

const electionFile = fs.readFileSync('./Elections/' + myArgs[0], { encoding: 'utf-8' });
const electionFileLines = electionFile.split('\r\n');
var electionHeader = [];
var countyData = [];
readCSV(electionFileLines, electionHeader, countyData);

const colorFile = fs.readFileSync('./Palettes/' + myArgs[1], { encoding: 'utf-8' });
const colorFileLines = colorFile.split('\r\n');
var colorHeader = [];
var newColors = [];
readCSV(colorFileLines, colorHeader, newColors);
var numColors = (colorHeader.length - 1) * (newColors.length);

var newShpNumbers = [];
var shpRow = [];
for (i = 0; i < numColors; i++){
    shpRow.push('shp' + i);
    if ((i + 1) % (colorHeader.length - 1) == 0){
        newShpNumbers.push(shpRow);
        shpRow = [];
    }
}

// Replace spaces in county names with underscores
for(i = 0; i < countyData.length; i++){ 
    var countyName = countyData[i][0];
    for(j = 0; j < countyName.length; j++){
        if (countyName[j] == " "){
            var newCountyName = countyName.substr(0, j) + "_" + countyName.substr(j + 1, countyName.length);
            countyData[i][0] = newCountyName; 
        }
    }
}


// read XML file
fs.readFile("BlankTexasCountyMap.svg", "utf-8", (err, data) => {
    if (err) {
        throw err;
    }
    // convert XML data to JSON object
    xml2js.parseString(data, (err, result) => {
        if (err) {
            throw err;
        }
        var colorRow = 0;
        var colorColumn = 0;
        var newColorString = "\n\t\ttspan { white-space: pre }\n";
        for(i = 0; i < numColors; i++){
            newColorString += "\t\t.shp" + i + "{ fill: #" + newColors[colorRow][colorColumn + 1] + ";stroke: #ffffff;stroke-width: 1.034 } \n"
            colorColumn++;
            if (colorColumn >= (newColors[0].length - 1)){
                colorRow++;
                colorColumn = 0;
            }
        }
        result.svg.style = newColorString;

        for(i = 0; i < countyData.length - 1; i++){
            var foundCounty = false;
            var svgCountyName = "TX_" + countyData[i][0];
            for(j = 0; j < 254; j++){
                if (svgCountyName ==  result.svg.g[0].path[j].$.id){
                    marginNeeded = .9;
                    var winner = Number(countyData[i][countyData[i].length - 1]) - 1;
                    for(colorNumber = 1; colorNumber <= newColors[0].length; colorNumber++){
                        winningPercent = parseFloat(countyData[i][(winner + 1) * 2]) / 100.0 
                        if (winningPercent > marginNeeded){
                            result.svg.g[0].path[j].$.style = "fill:#" + newColors[winner][colorNumber] + ";fill-opacity:1";
                            result.svg.g[0].path[j].$.class = newShpNumbers[winner][colorNumber - 1];
                            foundCounty = true;
                            break;
                        }
                        marginNeeded -= .1;
                    }
                    break;
                }
            }
            if (!foundCounty){
                console.log("Could not find " + countyData[i][0] + ". Check spelling in CSV.");
            }
            
        }

        // convert SJON objec to XML
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(result);

        // write updated XML string to a file
        fs.writeFile('./Finished_Maps/' + myArgs[0].substr(0, myArgs[0].length - 4) + '.svg', xml, (err) => {
            if (err) {
                throw err;
            }

            console.log('New map written to ' + myArgs[0].substr(0, myArgs[0].length - 4) + '.svg');
        });

    });
});

function readCSV (lineByLineData, attributeNames, attributeData) {
    var attributeName;
    for(i = 0; i < lineByLineData[0].length; i++){
        if (lineByLineData[0][i] == ','){
            attributeNames.push(attributeName);
            attributeName = '';
        }
        else{
            attributeName += lineByLineData[0][i];
            if (i == (lineByLineData[0].length - 1)){
                attributeNames.push(attributeName);
            }
        }
    }
    
    for (i = 1; i < lineByLineData.length; i++){
    
        attributeName = '';
        attribute = [];
        for(j = 0; j < lineByLineData[i].length; j++){
            if (lineByLineData[i][j] == ','){
                attribute.push(attributeName);
                attributeName = '';
            }
            else{
                attributeName += lineByLineData[i][j];
                if (j == (lineByLineData[i].length - 1)){
                    attribute.push(attributeName);
                }
            }
        }
        attributeData.push(attribute);
    }
}

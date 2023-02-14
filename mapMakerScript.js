const fs = require("fs");
const xml2js = require('xml2js');
const prompt = require('prompt-sync')({sigint: true});

var electionFileList = fs.readdirSync('./Elections/');
var paletteList = fs.readdirSync('./Palettes/');


console.log("Welcome to the Texas Election Map Generator! Please select an election to map:");
var electionSelected = false;
var electionFileName;

displayInThreeColumns(electionFileList, 5);

while (!electionSelected){
    var electionNumber = prompt("Choose election: ");
    if (fs.existsSync('./Elections/' + electionFileList[electionNumber - 1])){
        electionFileName = electionFileList[electionNumber - 1];
        electionSelected = true;
    }
}

console.log("You have chosen", electionFileName);

console.log("Here is a list of all available color palettes:");
var paletteSelected = false;
var paletteFileName;

displayInThreeColumns(paletteList, 3);

while (!paletteSelected){
    var paletteNumber = prompt("Please choose a color palette: ");
    if (fs.existsSync('./Palettes/' + paletteList[paletteNumber - 1])){
        paletteFileName = paletteList[paletteNumber - 1];
        paletteSelected = true;
    }
}

const electionFile = fs.readFileSync('./Elections/' + electionFileName, { encoding: 'utf-8' });
const electionFileLines = electionFile.split('\r\n');
var electionHeader = [];
var countyData = [];
readCSV(electionFileLines, electionHeader, countyData);

const colorFile = fs.readFileSync('./Palettes/' + paletteFileName, { encoding: 'utf-8' });
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

        for(i = 0; i < countyData.length; i++){
            var foundCounty = false;
            var svgCountyName = countyData[i][0];
            if (svgCountyName == "Total"){
                continue;
            }
            for(j = 0; j < 254; j++){
                if (svgCountyName ==  result.svg.g[0].path[j].$.id){
                    marginNeeded = .9;
                    var winner = Number(countyData[i][countyData[i].length - 1]) - 1;
                    for(colorNumber = 1; colorNumber <= newColors[0].length; colorNumber++){
                        winningPercent = parseFloat(countyData[i][(winner + 1) * 2]) / 100.0; 
                        if (winningPercent > marginNeeded){
                            result.svg.g[0].path[j].$.style = "fill:#" + newColors[winner][colorNumber] + ";fill-opacity:1";
                            result.svg.g[0].path[j].$.fill = "#" + newColors[winner][colorNumber];
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
        fs.writeFile('./Finished_Maps/' + electionFileName.substr(0, electionFileName.length - 4) + '.svg', xml, (err) => {
            if (err) {
                throw err;
            }

            console.log('New map written to ' + electionFileName.substr(0, electionFileName.length - 4) + '.svg');
        });

    });
});

/**
 * Reads in a CSV file in lines and returns two arrays
 * The first array contains all of the headings from the CSV
 * The second array contains all of the data from the CSV
 */
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

/**
 * Takes string data from an array and displays it in three columns
 * minPaddingLength determines the minimum amount of padding between the columns
 */
function displayInThreeColumns(data, minPaddingLength){

    // Determine the length of the longest item in data
    var maximumLength = 0;
    for (i = 0; i < data.length; i++){
        if (data[i].length > maximumLength){
            maximumLength = data[i].length;
        }
    }
    maximumLength += minPaddingLength;

    for(i = 0; i < data.length; i += 3){
        var numDigits = Math.floor(Math.log10(i + 1));
        if (i + 2 < data.length){
            var paddingLength = [maximumLength - data[i].length - numDigits, maximumLength - data[i + 1].length - numDigits];
            var padding = [new Array(paddingLength[0]).join(' '), new Array(paddingLength[1]).join(' ')]
            console.log(String(i + 1) + ":", data[i], padding[0], String(i + 2) + ":", data[i + 1], padding[1], String(i + 3) + ":", data[i + 2]);
        }
        else if (i + 1 < data.length){
            var paddingLength = maximumLength - data[i].length - numDigits;
            var padding = new Array(paddingLength).join(' ');
            console.log(String(i + 1) + ":", data[i], padding, String(i + 2) + ":", data[i + 1]);
        }
        else{
            console.log(String(i + 1) + ":", data[i]);
        }
        
    }
}
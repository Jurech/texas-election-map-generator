# Texas Election Map Generator

A Javascript program designed to ease the process of creating county-by-county maps of elections in the state of Texas. It takes in multiples CSVs as inputs, applies them to BlankTexasCountyMap.svg, and deposits the completed map in the Finished_Maps folder. Example:

![alt text](https://github.com/Jurech/texas-election-map-generator/blob/main/BlankTexasCountyMap.svg?raw=true) 
![alt text](https://github.com/Jurech/texas-election-map-generator/blob/main/Finished_Maps/2020Election.svg?raw=true)

The map on the right displays the results of the 2020 US Presidential Election in Texas.

# How to run

## Installing dependencies
Before running, the program must install dependencies. In the command prompt, navigate to the repo's folder and run the following:

    npm install

This will create the node_modules folder containing all the libraries required for this code to run.

## Running the program
This program is run through the command prompt using node. Use this command to run the program:

    node mapMakerScript.js [Election result file name] [Color palette file name]

The election result file must be a .csv file in the Elections folder, and the palette must be a csv in the Palettes folder.
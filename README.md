# Texas Election Map Generator

A Javascript program designed to ease the process of creating county-by-county maps of elections in the state of Texas. It takes in multiples CSVs as inputs, applies them to BlankTexasCountyMap.svg, and deposits the completed map as an SVG image in the Finished_Maps folder. Example:

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

The election result file must be a CSV file in the Elections folder, and the palette must be a CSV file in the Palettes folder.

# Data formatting
The data in the CSV files must be formatted in a particular way to get the program to run properly. It is recommended to use Microsoft Excel or Google Sheets to make the CSV files.

## Election results
The data in the first line does not affect the final map, but it should be formatted as such:

    County,[Candidate 1 name],%,[Candidate 1 name],%,...[Candidate X name],%,Total,Winner

All subsequent lines should be formatted as such:

    [County name],[Candidate 1 votes],[Candidate 1 vote percentage],[Candidate 2 votes],[Candidate 2 vote percentage],...[Candidate X votes],[Candidate X vote percentage],[Total votes in county],[Winning candidate number]

To obtain [Candidate X vote percentage], in Excel or Sheets, use the following operation on the cell:

    [Candidate x votes]/[Total votes in county]

Apply precision to the hundredth's place and add the '%' character at the end.

To obtain [Winning candidate number], use the following operation on the cell:

    =IFS(AND([Candidate 1 votes] > [Candidate 2 votes],... [Candidate 1 votes] > [Candidate X votes]), 1,... AND([Candidate X votes] > [Candidate 1 votes],... [Candidate X votes] > [Candidate Y votes]), X, TRUE, 0)

Ensure that every vote count is compared against every other vote count. If there is a tie for first place, the function will return 0. Currently, this will cause the program to ignore the county. Functionality will be developed later to color these counties properly.
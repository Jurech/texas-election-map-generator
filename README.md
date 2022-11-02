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

Remove commas from the raw vote counts before downloading to CSV. Any extra commas will break the program. The county names must be spelled exactly as they are in BlankTexasCountyMap.svg. If they are not, the county will not be colored and the program will notify you in the command prompt.

## Color palettes
The data in the first line does not affect the final map, but it should be formatted as such:

    Party,>90,80-90,70-80,60-70,50-60,[more ranges can be added as desired]

Each subsequent row should be formatted as such:

    [Party name],[>90% color],[80-90% color],...

Each color should be given as an RGB hex value without any prefixes or suffixes. The standard colors for Wikipedia county maps can be found [here](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_Elections_and_Referendums/USA_legend_colors).

# Planned functionality

* Prompt user to select files in the program instead of providing parameters
* Add standard color for when county results are not found
* Add functionality to determine colors for ties
* Less sensitive county name matching
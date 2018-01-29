Stream Huge files over the network.

Generate a huge.file/small.file file and keep it under the files directory

How to generate huge/small file from node cmd prompt

var fs = require('fs');
const file = fs.createWriteStream('./files/huge.file');
for(let i = 1; i <= 1e6; i++){
    file.write('There were a lot of deliberations later after play got over with the match officials leaving the ground around 7:00 p.m. local time. It was reported that they had submitted their report to the ICC.\n');
}
file.end();

Similarly, create a small file with lesser for loop length like 1e4.

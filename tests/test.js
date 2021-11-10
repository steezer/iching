const fs=require("fs")

let content=fs.readFileSync("../data/wordUnkown.txt").toString();
let words=[]
content.split("\n").forEach(e=>{
	let word=e.match(/^(.*?)\(/)[1];
	words.push(word);
});
console.log(JSON.stringify(words));
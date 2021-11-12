const util=require("./lib/util");

let datas=util.readJson("./data/export/basic.json");
let total=0;
datas.forEach(e=>{
    total+=util.wordSplit(e.hexagram).length;
    e.trigrams.forEach(t=>{
        total+=util.wordSplit(t).length-2;
    });
});
console.log(total);

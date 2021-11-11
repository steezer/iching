const util=require("./lib/util");
let hexagrams=util.readJson("./data/export/hexagram.json");

console.log(hexagrams);
hexagrams.forEach(e=>{
    if(typeof(e.analysis)=='string'){
        e.analysis=[e.analysis];
    }
})


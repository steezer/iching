const util=require("./lib/util");

let hexagrams=util.readJson("./data/export/hexagram.json");
hexagrams.forEach(e=>{
    if(typeof(e.analysis)=='string'){
        e.analysis=[e.analysis];
    }
})

util.saveJson("./data/export/hexagram.json", hexagrams);

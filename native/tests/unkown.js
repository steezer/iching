const util=require("../lib/util");
const stats=require("../../data/wordStats.json");
const datas=require("../../data/export/basic.json");
const unkowns=require("../../data/unkown.json");

function getIndex(results, item){
    let result=-1;
    item.position.forEach((e,i)=>{
        let index=results.findIndex(r=>{
            let index=r.position.findIndex(n=>(n[0]==e[0]&&n[1]==e[1]));
            return index!=-1;
        });
        if(index!=-1 && result==-1){
            result=index;
        }
    });
    return result;
}


function getUnkownGroup(){
    let results=[];
    unkowns.forEach(w=>{
        let item=stats.find(e=>e.word==w);
        let index=getIndex(results, item);
        if(index==-1){
            results.push({
                names: [item.word],
                position: [...item.position]
            });
        }else{
            results[index].names.push(item.word);
            item.position.forEach(e=>{
                let pos=results[index].position.findIndex(r=>(r[0]==e[0]&&r[1]==e[1]));
                if(pos==-1){
                    results[index].position.push(e);
                }
            });
        }
    });
    return results;
}

function printUnkowns(){
    unkowns.forEach(w=>{
        console.log(w);
        let item=stats.find(e=>e.word==w);
        item.position.forEach((e,i)=>{
            let hexaItem=datas.find(r=>r.index==e[0]);
            let label=(i+1)+'. '+hexaItem.name+'卦（'+hexaItem.index+'）- ';
            if(e[1]==-1){
                console.log(label+hexaItem.hexagram);
            }else{
                console.log(label+hexaItem.trigrams[e[1]]);
            }
        });
        console.log("");
    })
}

function printUnkownsByGroup(){
    let results=getUnkownGroup();
    results.forEach((item, dx)=>{
        console.log((dx+1)+": "+item.names.join(" "));
        item.position.forEach((e,i)=>{
            let hexaItem=datas.find(r=>r.index==e[0]);
            let label='('+(i+1)+'). '+hexaItem.name+'卦（'+hexaItem.index+'）- ';
            if(e[1]==-1){
                console.log(label+hexaItem.hexagram);
            }else{
                console.log(label+hexaItem.trigrams[e[1]]);
            }
        });
        console.log("");
    })
}

//printUnkowns();
printUnkownsByGroup();

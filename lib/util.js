const fs=require("fs");

/**
 * 预测标签定义
 */
const labelDefines={
	career: '事业',
	business: '经商',
	fame: '求名',
	travel: '外出',
	marry: '婚恋',
	decision: '决策'
};

/**
 * 获取JSON文件的数据
 * 
 * @param {String} savePath 
 * @return {Object}
 */
 function readJson(savePath){
	let content=fs.readFileSync(savePath).toString();
    content=content.replace(/\/\*[\S\s]*?\*\//g, '');
    content=content.split("\n").map(line=>{
        return line.replace(/\/\/[^"']*?$/g, '')
    }).join("\n");
    // return content;
    return JSON.parse(content);
}

/**
 * 保存JSON数据到文件
 * 
 * @param {String} savePath 
 * @param {Object} data 
 */
 function saveJson(savePath, data){
    var content=JSON.stringify(data, null, "\t");
	fs.writeFileSync(savePath, content);
}

/**
 * 根据二进制获取十进制值
 * 
 * @param  {String} binStr 二进制字符串
 * @return {Number}        十进制值
 */
function getValue(binStr){
	let str=binStr.split("").reverse().join("");
	return parseInt(str, 2);
}

/**
 * 获取爻辞编号
 * 
 * @param {String} binStr 
 * @param {String} suffix 
 * @returns {Array}
 */
function getTrigramIndexes(binStr, suffix="："){
    let trigrams=[];
    let chars=binStr.split("").reverse();
    let tags=['二', '三', '四', '五'];
    chars.forEach((c,i)=>{
        let name=c==='0'?'六':'九';
        if(!i||i==chars.length-1){
            let tag=!i ? '初' : '上';
            trigrams.push(tag+name+suffix);
        }else{
            let tag=tags[i-1];
            trigrams.push(name+tag+suffix);
        }
    });
    
    let value=getValue(binStr);
    if(value==63 || value==0){
        trigrams.push((value==0?'用六':'用九')+suffix);
    }
    return trigrams;
}

/**
 * 获取预测解释
 * 
 * @param  {Array} rawLists 原始序列
 * @return {Object}         结果
 */
function getPrediction(rawLists){
	let labels=Object.assign({}, labelDefines);
	let keys=Object.keys(labels);
	keys.forEach(key=>{
		let label=labels[key];
		let value=rawLists.find(e=>e.split('：')[0]==label);
		labels[key]=value?value.split('：')[1]:'';
	});
	return labels;
}

/**
 * 数据项检测
 * 
 * @param  {Object} data 全部值
 * @return {Boolean}     结果
 */
function checkResults(data){
	let isOk=true;
	data.forEach(e=>{
		let keys=Object.keys(e);
		keys.forEach(k=>{
			if(e[k]==''){
				isOk=false;
				console.log(e.index);
			}
		});
	});
	return isOk;
}

/**
 * 值检测
 * 
 * @param  {Object} data 全部值
 * @return {Boolean}     结果
 */
function checkValue(data){
	let results=[];
	let isOk=true;
	data.forEach((item, index)=>{
		let value=getValue(item.value);
		if(results.indexOf(value)!=-1){
			console.log(index+1, value);
			isOk=false;
		}else{
			results.push(value);
		}
	});
	return isOk;
}

/**
 * 将文本转换为JSON格式
 * 
 * @param  {String} dataPath   原始文本路径
 * @param  {String} exportPath 保存路径
 * @return {Array}             结果JSON
 */
function convert(dataPath, exportPath){
	let content=fs.readFileSync(dataPath);
	let lists=content.toString().split("\n\n");
	let results=lists.map(res=>{
		let index=parseInt(res.substr(1,2));
		let rows=res.split("\n");
		let name=rows[0].match(/（(.*?)卦）/)[1];
		let titles=rows[0].split(/\s+/).splice(1);
		let evaluate=rows[1];
		let title=titles[0].replace(/（.*?卦）/,'');
		let subTitle=titles[1];
		let desc=rows[2].split("：")[1];
		let detail=rows[3];
		let predict=getPrediction(rows.splice(4));
		return {
			index, // 序号（从1开始）
			name, // 名称（如：乾、坤）
			evaluate, // 评估（如：中下卦）
			title, // 标题（如：乾为天）
			subTitle, // 副标题（如：刚健中正）
			desc, // 象曰（如：困龙得水好运交，不由喜气上眉梢，一切谋望皆如意，向后时运渐渐高。）
			detail, // 详细解说
			predict
		}
	});
	if(checkResults(results)){
		if(typeof(exportPath)!="undefined"){
            saveJson(exportPath, results);
		}
		results;
	}
	return null;
}

/**
 * 根据值排序
 * 
 * @param  {Array} data 初始结果
 * @return {Array}      排序结果
 */
function sortByValue(data){
	return data.sort((item1, item2)=>{
		let value1=getValue(item1.value);
		let value2=getValue(item2.value);
		return value1>value2 ? 1 : -1;
	});
}

/**
 * 获取相对的项
 *
 * @param  {Array} data 全部结果
 * @param  {Object} item 当前项
 * @return {Object}      相对项
 */
function getOpposite(data, item){
	let value=getValue(item.value);
	let oValue=value ^ ((1<<6)-1);
	return data.find(item=>oValue==getValue(item.value));
}

/**
 * 根据值输出
 * 
 * @param  {Array} data 初始结果
 */
 function printByValue(data, getNear=false){
	sortByValue(data);
	data.forEach((e, i)=>{
		let oe=getOpposite(data, e);
        let contents=[
			(i+1)+":", 
			e.name, "(第"+e.index+"卦)",
			"->",
			oe.name, "(第"+oe.index+"卦)"
		];
        let isNear=(e.index+1==oe.index || e.index-1==oe.index);
		(!getNear || isNear) && console.log(contents.json(" "));
	});
}


/**
 * 导出列表
 * 
 * @param {Object} datas 
 * @param {Object} template 
 * @param {String} type 类型 
 */
 function exportLists(datas, template, type){
    if(typeof(template[type])=='object'){
        let results=[];
        datas.forEach(item=>{
            let obj=Object.assign({}, template[type]);
            if(type=='basic'){
                obj['trigrams']=getTrigramIndexes(item.value);
            }
            for (const key in obj) {
                if (typeof(item[key])!='undefined') {
                    if(
                        typeof(obj[key])=='object' && 
                        typeof(item[key])=='object'
                    ){
                        Object.assign(obj[key], item[key]);
                    }else{
                        obj[key] = item[key]; 
                    }
                }
            }
            results.push(obj);
        });
        saveJson("./data/export/"+type+".json", results);
    }
}

/**
 * 拆分字符串为字
 * 
 * @param {String} str 
 * @returns {Array}
 */
 function wordSplit(str){
    let words=str.split("");
    let excepts=['。', '，', '；', '、', '：', '？',' '];
    return words.filter(w=>{
        return excepts.indexOf(w)==-1;
    });
 }
 
 /**
  * 添加关键字
  * 
  * @param {String} word 
  * @param {Number} hexaIndex 
  * @param {Number} triIndex 
  * @param {Array} keywords 
  */
 function addKeyword(word, hexaIndex, triIndex, keywords){
     let index=keywords.findIndex(e=>e.word==word);
     let location=[hexaIndex,triIndex];
     if(index==-1){
         keywords.push({
             word,
             count: 1,
             position: [location]
         });
     }else{
         keywords[index].count+=1;
         keywords[index].position.push(location);
     }
 }
 
 /**
  * 将数字转为汉字
  * 
  * @param {Number} num 
  * @returns {String}
  */
 function toChineseNum(num){
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
            let tmp = i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]);
            newNum = (i == 0 && strArr[i] == 0 ? "" : tmp) + newNum;
        }
        return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) { noWan = "0" + noWan; }
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

module.exports={
    labelDefines,
    readJson,
    saveJson,
    convert,
    checkValue,
    sortByValue,
    getOpposite,
    printByValue,
    exportLists,
    wordSplit,
    addKeyword,
    toChineseNum
}

export function toChinesNum(num) {
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

export function getJson(url) {
    return fetch(url).then(res => {
        return res.json();
    });
}

export async function loadModule(name) {
    const getTemplate = function (content) {
        const scriptRegex = /<script>(.*?)<\/script>/si;
        const TplRegex = /<template>(.*?)<\/template>/si;
        let results = content.replace(scriptRegex, '').match(TplRegex);
        if (results) {
            return results[1];
        }
        return false;
    }

    const getScript = function (content) {
        const scriptRegex = /<script>(.*?)<\/script>/si;
        const defRegex = /export\s+default\s+\{(.*?)\}\s*$/si;
        let results = content.match(scriptRegex);
        if (results) {
            const script = results[1];
            return script.replace(defRegex, function ($_, $0) {
                return '({' + $0 + '})'
            });
        }
    }
    
    let url=name.replace('@/', 'lib/module/');
    const res = await fetch(url);
    const content = await res.text();
    
    let script = getScript(content);
    let config = eval.call(this, script);
    
    let template = getTemplate(content);
    if (template) {
        config['template'] = template;
    }
    return config
}

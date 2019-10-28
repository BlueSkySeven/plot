/**
 * 计算显示的字符串
 * @param str 要裁剪的字符串
 * @param maxWidth 最大宽度
 * @param fontSize 字体大小
 */
const fittingString = (str: string, maxWidth: number, fontSize: number): string => {
    const fontWidth = fontSize * 1.3; // 字号+边距
    maxWidth = maxWidth * 2; // 需要根据自己项目调整
    const width = calcStrLen(str) * fontWidth;
    const ellipsis = '…';
    if (width > maxWidth) {
        const actualLen = Math.floor((maxWidth - 10) / fontWidth);
        const result = str.substring(0, actualLen) + ellipsis;
        return result;
    }
    return str;
}

/**
 * 计算字符串的长度
 * @param str 指定的字符串
 */
const calcStrLen = (str: string): number => {
    let len = 0;
    if (!str) return len;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
};


/**
 * 计算字符串的长度
 * @param str 指定的字符串
 */
const conversionData = (data: any): object => {
    const columns = [];
    const nodeArr = [];
    data.records.forEach(cur => {
        columns.push(...cur.keys);
        nodeArr.push(cur._fields);
    });
    data.results = [{
        columns: [...new Set(...columns)],
        data: [
            ...nodeArr
        ]
    }];
    return data;
};


export {
    fittingString,
    calcStrLen,
    conversionData
}
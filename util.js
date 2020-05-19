formatDate(curr){
  const now=new Date(curr);
  const year=now.getFullYear();
  const month=now.getMonth()+1;
  const date=now.getDate();
  const hour=now.getHours();
  const minute=now.getMinutes();
  const second=now.getSeconds();
  return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
},
substr(str: string, n?: number, convergence?: string): string {
  if (!n) {
    n = 12;
  }
  if (!convergence) {
    convergence = "......";
  }
  return `${str.substr(0, n)}${convergence}${str.substr(-n, n)}`;
},
effectiveNumber(str, n) {
  if (typeof str !== "string") {
    str = str.toString();
  }
  if (!n) {
    n = VIRTUAL_DIGIT;
  }
  if (str.indexOf(".") < 0 ) {
    if (isNaN(Number(str))) {
      return "-";
    } else {
      return Number(str);
    }
  } else {
    if (isNaN(Number(str))) {
      return "-";
    } else {
      return Number(`${str.split(".")[0]}${"."}${str.split(".")[1].substr(0, Number(n))}`);
    }
  }
},
/**
 * 解决两个数相加精度丢失问题
 */
floatAdd(a, b) {
  // tslint:disable-next-line:one-variable-per-declaration
  let c, d, e;
  if (undefined === a || null == a || "" === a || isNaN(a)) {a = 0; }
  if (undefined === b || null == b || "" === b || isNaN(b)) {b = 0; }
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return  (this.floatMul(a, e) + this.floatMul(b, e)) / e;
},
/**
 * 解决两个数相减精度丢失问题
 */
floatSub(a, b) {
  // tslint:disable-next-line:one-variable-per-declaration
  let c, d, e;
  if ( undefined === a || null == a || "" === a || isNaN(a)) { a = 0; }
  if ( undefined === b || null == b || "" === b || isNaN(b)) { b = 0; }
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (this.floatMul(a, e) - this.floatMul(b, e)) / e;
},
/**
 * 解决两个数相乘精度丢失问题
 */
floatMul(a, b) {
  // tslint:disable-next-line:one-variable-per-declaration prefer-const
  let c = 0, d = a.toString(), e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {;}
  try {
    c += e.split(".")[1].length;
  } catch (f) {;}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
},
/**
 * 解决两个数相除精度丢失问题
 */
floatDiv(a, b) {
  // tslint:disable-next-line:one-variable-per-declaration
  let c, d, e = 0, f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {;}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {;}
  return c = Number(a.toString().replace(".", "")), d =
    Number(b.toString().replace(".", "")), this.floatMul(c / d, Math.pow(10, f - e));
},
scientificNotationToString(param) {
  const strParam = String(param);
  const flag = /e/.test(strParam);
  if (!flag) { return param; }
  // 指数符号 true: 正，false: 负
  let sysbol = true;
  if (/e-/.test(strParam)) {
    sysbol = false;
  }
  // 指数
  // @ts-ignore
  const index = Number(strParam.match(/\d+$/)[0]);
  // 基数
  // @ts-ignore
  const basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, "");
  if (sysbol) {
    // @ts-ignore
    return basis.padEnd(index + 1, 0);
  } else {
    // @ts-ignore
    return basis.padStart(index + basis.length, 0).replace(/^0/, "0.");
  }
},
findRepeat(array) {
  const arr = array.map(it => it.hash);
  const m = arr.reduce((pre, cur) => {
    if (cur in pre) {
      pre[cur]++;
    } else {
      pre[cur] = 1;
    }
    return pre;
  }, {});
  const n = [];
  for (const v in m) {
    if (m[v] > 1) {
      // @ts-ignore
      n.push(v);
    }
  }
  return n;
},



import XLSX from "xlsx";
exportExcel(headers, data, fileName = 'filename.xlsx') {
  // tslint:disable-next-line:variable-name
  const _headers = headers
      .map((item, i) => Object.assign({}, { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + 1 }))
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {});
  // tslint:disable-next-line:variable-name
  const _data = data
      .map((item, i) => headers.map((key, j) => Object.assign({}, { content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) })))
      // 对刚才的结果进行降维处理（二维数组变成一维数组）
      .reduce((prev, next) => prev.concat(next))
      // 转换成 worksheet 需要的结构
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {});
  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign(
          {},
          output,
          {
            '!ref': ref,
            '!cols': [{ wpx: 45 }, { wpx: 100 }, { wpx: 200 }, { wpx: 80 }, { wpx: 150 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }],
          },
      ),
    },
  };
  XLSX.writeFile(wb, fileName);
  return "";
}
const initColumn = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'text-monospace',
    }
]

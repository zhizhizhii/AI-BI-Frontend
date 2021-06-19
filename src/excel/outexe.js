import { export_json_to_excel } from "@/excel/Export2Excel";
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]));
}

function export2Excel(fileName, tHeader, filterVal, excelData) {
  const data = formatJson(filterVal, excelData);
  export_json_to_excel(tHeader, data, fileName);
}
/*tHeader_导出的表头名;
const tHeader = []
*/

/*filterVal_导出的表头字段名;
const filterVal = [];
*/

/*excelData_导出的数据;
const excelData= []
*/
function printExe(fileName, tHeader, filterVal, excelData) {
  console.log('printExe executed');
  export2Excel(fileName, tHeader, filterVal, excelData);
}

export default printExe
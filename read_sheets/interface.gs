/*   
   https://github.com/souparno/google-sheet-database/blob/master/www/index.html
   
   Copyright 2011 Martin Hawksey
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
       http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// Usage
//  1. Enter sheet name where data is to be written below
var SHEET_NAME = "Formulierreacties 1";
var SHEET_TIJDEN = "Racetijden";
        
//  2. Run > setup
//
//  3. Publish > Deploy as web app 
//    - enter Project Version name and click 'Save New Version' 
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously) 
//
//  4. Copy the 'Current web app URL' and post this in your form/script action 
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(e){
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

function handleResponse(e) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  
  try {
    var action = e.parameter.action;
    
    if (action == 'create') {
      return create(e);
    } else if (action == 'retrieve') {
      return retrieve(e);
    } else if (action == 'update') {
      return update(e);  
    } else if (action == 'getRaces') {
      return getRaces(e);
    } else if (action == 'startRace') {
      return startRace(e);
    } else {
      return geefHint(e);
    }
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function getDataArr(headers, e){
    var row = [];
    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
        row.push(new Date());
      } else { // else use header name to get data
        row.push(e.parameter[headers[i]]);
      }
    }
    
    return row;
}

function getDataCol(headers, e){
  //var cl = SpreadsheetApp.getActiveSheet().getRange("RangeName").getColumn();
  var result = [];
  for (i in e.parameter){ //i: action, rowId, <welke header>
    index = headers.indexOf(i);
    if (index > 0) return index;
    result.push([i, headers.indexOf(i)]);
  }
  //for (i in headers){ //i: 0..15
  //  result.push(i);
  //}
  // When not found, return map of [nr, parameter] for debugging
  return result;
}
  

function create(e) {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var numColumns = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = getDataArr(headers, e);
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
}

function retrieve(e) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var numRows = sheet.getLastRow();
  var numColumns = sheet.getLastColumn();
  
  var header_range = sheet.getRange(1, 1, 1, numColumns);
  var headers = header_range.getValues();
  
  var values_range =  sheet.getRange(2, 1, numRows-1, numColumns);
  var values = values_range.getValues();
    
  return ContentService
  .createTextOutput(JSON.stringify({"result":"success", "headers": headers, "values": values}))
    .setMimeType(ContentService.MimeType.JSON);
}

function update(e) {
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_TIJDEN);
  
  var numColumns = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
  var col = getDataCol(headers, e);
  var data = e.parameter[headers[col]];
  
  var row = getDataArr(headers, e);
  var rowId = e.parameter.rowId;
    
  // more efficient to set values as [][] array than individually
  //sheet.getRange(rowId, 1, 1, numColumns).setValues([row]);
  sheet.getRange(rowId, 1 + col).setValue(data);
  
  // return json success results
  return ContentService
      .createTextOutput(JSON.stringify({
        "result":"success",
        "row": rowId,
        "col": col,
        "data": data,
        "getDataArr": row,
        "e": e,
      }))
      .setMimeType(ContentService.MimeType.JSON);
}

//----------------------------------------------------------------------------------------

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}

//----------------------------------------------------------------------------------------

function getRaces(e) {
  console.log("getRaces start");
  
  var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
  var sheet = doc.getSheetByName(SHEET_NAME);
  var numRows = sheet.getLastRow();
  var numColumns = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
  
  var kolom = 3;
  //console.log("kolom:" + kolom);
  
  var range = sheet.getRange(2, kolom, numRows-1);
  //console.log("numRows:" + numRows);
  
  var values = range.getValues();
  console.log("values: " + values);
              
  return ContentService
    .createTextOutput(JSON.stringify({"result":"success", "values": values}))
    .setMimeType(ContentService.MimeType.JSON);
}

//------------------------------------------------------------------------------------------

function startRace(e) {
  console.log("startRace start");
  
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_TIJDEN);
    
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var numColumns = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, numColumns).getValues()[0];
    var nextRow = sheet.getLastRow() + 1; // get next row
    var row = getDataArr(headers, e);
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results
    return ContentService
    .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
}
  
//------------------------------------------------------------------------------------------

function geefHint(e) {
  Logger.log("Geef een hint");
    return ContentService
    .createTextOutput(JSON.stringify({"result":"fail", "e": e}))
          .setMimeType(ContentService.MimeType.JSON);
}
  

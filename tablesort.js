var TableSort = {};


TableSort.arrowNone = " &nbsp;";
TableSort.arrowUp   = " &uarr;";
TableSort.arrowDown = " &darr;";


TableSort.tables = [];


TableSort.lastSort = [];


if (window.onload) {
  TableSort.oldOnload = window.onload;
}

window.onload = function() {
  TableSort.init();
  if (TableSort.oldOnload) {
    TableSort.oldOnload();
  }
}


TableSort.init = function() {
  if (navigator.appName == "Microsoft Internet Explorer" &&
      navigator.platform.indexOf("Mac") == 0) {
    return;
  }
  if (arguments.length == 0) {
    var tableNodeList = document.getElementsByTagName('TABLE');
    for (var x = 0; x < tableNodeList.length; x++) {
      TableSort.tables.push(tableNodeList[x]);
      TableSort.initTable(x);
    }
  } else {
    var table;
    for (var x = 0; x < arguments.length; x++) {
      table = document.getElementById(arguments[x]);
      if (table) {
        TableSort.tables.push(table);
        TableSort.initTable(TableSort.tables.length - 1);
      }
    }
  }
}



TableSort.initTable = function(t) {

  var table = TableSort.tables[t];
  if (table.tHead) {
    for (var y = 0; y < table.tHead.rows.length; y++) {
      for (var x = 0; x < table.tHead.rows[y].cells.length; x++) {
        TableSort.linkCell(table.tHead.rows[y].cells[x], t, x, y);
      }
    }
  }
  if (table.tFoot) {
    for (y = 0; y < table.tFoot.rows.length; y++) {
      for (x = 0; x < table.tFoot.rows[y].cells.length; x++) {
        TableSort.linkCell(table.tFoot.rows[y].cells[x], t, x, y);
      }
    }
  }
  TableSort.lastSort[t] = 0;
}


TableSort.linkCell = function(cell, t, x, y) {

  if (TableSort.getLabel(cell)) {
    var link = document.createElement('A');
    link.href = "#Sort_" + t + "_" + x;
    link.title = "Sort by this column";
    link.onclick = new Function("TableSort.click(" + t + ", " + x + ", \"" +
        escape(TableSort.getLabel(cell)) + "\"); return false");
    cell.appendChild(link);
    for (var c = 0; c < cell.childNodes.length - 1; c++) {
      link.appendChild(cell.childNodes[c]);
    }
    var arrow = document.createElement('SPAN');
    arrow.innerHTML = TableSort.arrowNone;
    arrow.name = "TableSort_" + t + "_" + x + "_" + y;
    cell.appendChild(arrow);
  }
}



TableSort.getLabel = function(cell) {
  var str;
  if (window.opera) {
    var m = cell.outerHTML.match(/^<[^>]+LABEL=['"]*([^'" ]+)['"]*/i);
    str = m ? m[1] : "";
  } else {
    str = cell.getAttribute('label');
  }
  return str ? str.toLowerCase() : '';
}


TableSort.click = function(table, column, mode) {


  if (!mode.match(/^[_a-z0-9]+$/)) {
    alert("Illegal sorting mode type.");
    return;
  }
  var compareFunction = eval("TableSort.compare_" + mode);
  if (typeof compareFunction != "function") {
    alert("Unknown sorting mode: " + mode);
    return;
  }
  var reverse = false;
  if (Math.abs(TableSort.lastSort[table]) == column + 1) {
    reverse = TableSort.lastSort[table] > 0;
    TableSort.lastSort[table] = -TableSort.lastSort[table];
  } else {
    TableSort.lastSort[table] = column+1;
  }
  var spans = document.getElementsByTagName('SPAN');
  var spanprefix1 = "TableSort_" + table + "_";
  var spanprefix2 = "TableSort_" + table + "_" + column;
  for (var s = 0; s < spans.length; s++) {
    if (spans[s].name && spans[s].name.substring(0, spanprefix1.length) ==
        spanprefix1) {
      if (spans[s].name.substring(0, spanprefix2.length) == spanprefix2) {
        if (TableSort.lastSort[table] > 0) {
          spans[s].innerHTML = TableSort.arrowDown;
        } else {
          spans[s].innerHTML = TableSort.arrowUp;
        }
      } else {
        spans[s].innerHTML = TableSort.arrowNone;
      }
    }
  }
  if (TableSort.tables[table].tBodies.length < 1) {
    return;
  }
  var tablebody = TableSort.tables[table].tBodies[0];
  var cellDictionary = [];
  var cell;
  for (var y = 0; y < tablebody.rows.length; y++) {
    if (tablebody.rows[y].cells.length > 0) {
      cell = tablebody.rows[y].cells[column];
    } else {
      cell = tablebody.rows[y].childNodes[column];
    }
    cellDictionary[y] = [TableSort.dom2txt(cell), tablebody.rows[y]];
  }

  cellDictionary.sort(compareFunction);

  var i;
  for (y = 0; y < cellDictionary.length; y++) {
    i = reverse ? (cellDictionary.length - 1 - y) : y;
    tablebody.appendChild(cellDictionary[i][1]);
  }
  if (window.opera) {

    setTimeout(function() {

      tablebody.appendChild(tablebody.removeChild(
          tablebody.rows[tablebody.rows.length - 1]));
    }, 1);
  }
}


TableSort.dom2txt = function(obj) {
  var text = "";
  if (!obj) {
    return "";
  }
  if (obj.nodeType == 3) {
    text = obj.data;
  } else {
    for (var x = 0; x < obj.childNodes.length; x++) {
      text += TableSort.dom2txt(obj.childNodes[x]);
    }
  }
  return text;
}


TableSort.compare_case = function(a, b) {
  if (a[0] == b[0]) {
    return 0;
  }
  return (a[0] > b[0]) ? 1 : -1;
}


TableSort.compare_nocase = function(a, b) {
  var aLower = a[0].toLowerCase();
  var bLower = b[0].toLowerCase();
  if (aLower == bLower) {
    return 0;
  }
  return (aLower > bLower) ? 1 : -1;
}


TableSort.compare_num = function(a, b) {
  var aNum = parseFloat(a[0]);
  if (isNaN(aNum)) {
    aNum = -Number.MAX_VALUE;
  }
  var bNum = parseFloat(b[0]);
  if (isNaN(bNum)) {
    bNum = -Number.MAX_VALUE;
  }
  if (aNum == bNum) {
    return 0;
  }
  return (aNum > bNum) ? 1 : -1;
}

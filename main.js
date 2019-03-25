// make dataset globally available
var dz;

// load dataset and create table
function load_dataset(csv) {
    var data = d3.csv.parseRows(csv)
    var expensesAvgAmount = d3.nest()
        .key(function(d) { return d[0]; })
        .rollup(function(v) { return d3.mean(v, function(d) { return d[3]; }); })
        .entries(data);
    console.log(JSON.stringify(expensesAvgAmount))  
    expensesAvgAmount.forEach(function(d){ d.key = new Date(d.key * 1000);});
    expensesAvgAmount.forEach(function(d){ d.key = d.key.getUTCFullYear()+"-"+('0'+(d.key.getUTCMonth()+1)).slice(-2)+"-"+('0'+(d.key.getUTCDate())).slice(-2)+" "+('0'+(d.key.getUTCHours())).slice(-2)+":"+('0'+(d.key.getUTCMinutes())).slice(-2)+":"+('0'+(d.key.getUTCSeconds())).slice(-2);});   
    expensesAvgAmount.shift()
    expensesAvgAmount.pop()
    create_table(expensesAvgAmount);
    var trace1 = [{
        x: unpack(expensesAvgAmount, 'key'),
        y: unpack(expensesAvgAmount, 'values'),
        mode: 'lines+markers', 
        marker: {
            color: '#98002e',
            size: 6,
        },
        type: 'scatter'

    }];
    
    Plotly.newPlot('myDiv', trace1);
}


function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}


// create a table with column headers, types, and data
function create_table(data) {
  // table stats
  var keys = d3.keys(data[0]);
  console.log(data[0])
  var stats = d3.select("#stats")
    .html("")

  stats.append("div")
    .text("Columns: " + keys.length)

  stats.append("div")
    .text("Rows: " + data.length)

  d3.select("#table")
    .selectAll("tr.row")
      .data(data)
    .enter().append("tr")
      .attr("class", "row")
      .selectAll("td")
      .data(function(d) { return keys.map(function(key) { return d[key] }) ; })
      .enter().append("td")
        .text(function(d) { return d; });
}

// handle upload button
function upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();

  reader.onload = function(e) {
    var contents = e.target.result;
    callback(contents);
  };

  uploader.addEventListener("change", handleFiles, false);  

  function handleFiles() {
    var file = this.files[0];
    reader.readAsText(file);
  };
};
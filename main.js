// make dataset globally available
var dz;
var filename;
// load dataset and create table
function load_dataset(csv) {
    var data = d3.csv.parseRows(csv)

    var renderingData = d3.nest()
        .key(function(d) { return d[0]; })
        .rollup(function(v) { return d3.mean(v, function(d) { return d[3]; }); })
        .entries(data);

    renderingData.forEach(function(d){ d.key = new Date(d.key * 1000);});
    function sortbydate(a,b){
	return a.key - b.key;
	}
    renderingData = renderingData.sort(sortbydate);
    renderingData.forEach(function(d){ d.key = d.key.getUTCFullYear()+"-"+('0'+(d.key.getUTCMonth()+1)).slice(-2)+"-"+('0'+(d.key.getUTCDate())).slice(-2)+" "+('0'+(d.key.getUTCHours())).slice(-2)+":"+('0'+(d.key.getUTCMinutes())).slice(-2)+":"+('0'+(d.key.getUTCSeconds())).slice(-2);});   
    renderingData.shift()
    renderingData.pop()
    create_table(renderingData);
    var trace1 = [{
        x: unpack(renderingData, 'key'),
        y: unpack(renderingData, 'values'),
        mode: 'lines+markers', 
        marker: {
            color: '#98002e',
            size: 6,
        },
	type: 'scattergl',

    }];

	var layout = {
	  width: window.innerWidth,
	  height: window.innerHeight,
          title: filename,
	  titlefont: {
	        size:36,
	  },

 	  xaxis: {
	    title: 'UTC Time',
	    zeroline: true,
	    showline: true,
	    showgrid: true,
 	    zerolinecolor: '#000000',
            zerolinewidth: 4,
	    gridcolor: '#BFBFBF',
	    gridwidth: 2,
 	  },

 	  yaxis: {
 	    title: 'Delay',
	    type: 'log',
	    exponentformat: 'none',
	    showticklabels: true,
	    zeroline: true,
	    showline: true,
	    showgrid: true,
	    zerolinecolor: '#000000',
            zerolinewidth: 4,
	    gridcolor: '#BFBFBF',
	    gridwidth: 2,
 
	  }
	};


    
    Plotly.newPlot('myDiv', 
	trace1, layout,
{
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  modeBarButtonsToAdd: [{
    name: 'toImage2',
    icon: Plotly.Icons.camera,
    click: function(gd) {
      Plotly.downloadImage(gd)
    }
  }]
})
}


function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}


// create a table with column headers, types, and data
function create_table(data) {
  // table stats
  var keys = d3.keys(data[0]);
  var stats = d3.select("#stats")
    .html("")
  console.log(filename)
  stats.append("div")
    .text("Columns: " + keys.length)

  stats.append("div")
    .text("Rows: " + data.length)

 d3.select("#table")
    .html("")
    .append("tr")
    .attr("class","fixed")
    .selectAll("th")
    .data(["Time(UTC)", "Delay"])
    .enter().append("th")
      .text(function(d) { return d; });


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


function display_localfile(){
        filename = 'sessions-data.active.csv'
    	d3.select("#table").text("Data Content")
	d3.text("sessions-data.active.csv", function(text) {
	  load_dataset(text)
	});
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
    d3.select("#table").text("Data Content")
    var file = this.files[0];
    filename =file.name
    reader.readAsText(file);
  };
};

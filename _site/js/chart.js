/**
config: {
	name: string,
	target: jQuery Object,
	height: int,
	width: int,
	legend: string,
	clickEvent: function,
	color: string,
	xAsix: Array,
	yAsix: Array
}
*/

function Histogram(config) {
	var name = (config.name) ? config.name : '';
	var target = (config.target) ? config.target : $(document);
	var height = (config.height) ? config.height : 600;
	var width = (config.width) ? config.width : 600;
	var legend = (config.legend) ? config.legend : '';
	var clickEvent = (config.clickEvent) ? config.clickEvent : function(){console.log('clicked')};
	var color = (config.color) ? config.color : 'black';
	var xAsix = (config.xAsix) ? config.xAsix : [];
	var yAsix = (config.yAsix) ? config.yAsix : [];

	var _graph = $('<div id="graph"></div>');
	var _direction = 'positive';
	var _max = 0;
	var _min = 0;

	var _yMargin = 5;
	var _yLabelWidth = 70;
	var _yPositivePeak = 0;
	var _yNegativePeak = 0;

	var _xMargin = 5;
	var _xColumnWidth = 0;

	var _zeroLine = _yMargin;

	var _hoverZone = $('<div></div>');
	var _hoverColor = color;

	var _legendHeight = 30;
	var _legendMarginBottom = 30;

	function initGraph(){
		_graph.appendTo(target);
		_graph.css({
			'width': width,
			'height': height + _legendHeight + _legendMarginBottom,
			'position': 'relative'
		});

		var positive = false;
		var negative = false;
		for (var i = 0; i < yAsix.length; ++i){
			if (yAsix[i] < 0) negative = true;
			else positive = true;
			if (yAsix[i] < _min) _min = yAsix[i];
			if (yAsix[i] > _max) _max = yAsix[i];
		}
		if (positive && negative) _direction = 'bi';
		else if (positive && !negative) {
			_direction = 'positive';
			_min = 0;
		}
		else if (!positive && negative) {
			_direction = 'negative';
			_max = 0;
		}

		_hoverColor = Public.colorStep(color, 8);

		_hoverZone.css({
			'position': 'absolute',
			'display': 'none',
			'background-color': 'black',
			'color': 'white',
			'opacity': 0.8,
			'z-index': 10,
			'font-size': 12,
			'border-radius': 5,
			'border': '2px solid ' + Public.colorStep(color, -4),
			'min-width': 70,
			'height': 50
		})
		_hoverZone.appendTo(_graph);
	}

	function drawLegend(){
		var legendDiv = $('<div></div>');
		legendDiv.css({
			'position': 'absolute',
			'background-color': 'white',
			'height': _legendHeight,
			'border': '2px solid ' + Public.colorStep(color, -4),
			'border-radius': 5
		})
		var colorDiv = $('<div></div>');
		colorDiv.css({
			'float': 'left',
			'width': 30,
			'height': _legendHeight - 16,
			'margin-top': 6,
			'margin-left': 5,
			'margin-right': 5,
			'background-color': color
		})
		var contentDiv = $('<div></div>');
		contentDiv.css({
			'float': 'left',
			'font-size': 12,
			'margin-top': 6,
			'margin-right': 5
		})
		contentDiv.text(legend);
		colorDiv.appendTo(legendDiv);
		contentDiv.appendTo(legendDiv);
		legendDiv.appendTo(_graph);
	}

	function yAsixPeak(val){
		if (val == 0) return 0;
		var absolute = Math.abs(val).toString();
		var firstChar = absolute[0];
		var targetChar = '';
		var targetLength = absolute.length;
		if (firstChar == '9') {
			targetChar = '1';
			targetLength += 1;
		} else targetChar = (parseInt(firstChar) + 1).toString();
		for (var i = 1; i < targetLength; ++i) {
			targetChar += '0';
		}
		targetChar = parseInt(targetChar);
		return (val > 0) ? targetChar : -targetChar;
	}
	

	function yAsixLineCount(peak){
		if (peak == 0) return 0;
		var peakStr = Math.abs(peak).toString();
		if (peakStr[0] == '1') return 10;
		else return parseInt(peakStr[0]);
	}

	function drawYAsix(){
		_yPositivePeak = yAsixPeak(_max);
		_yNegativePeak = yAsixPeak(_min);
		var positiveLineCount = yAsixLineCount(_yPositivePeak);
		var negativeLineCount = yAsixLineCount(_yNegativePeak);
		var positiveDigitNumber = Math.abs(_yPositivePeak).toString().length;
		var negativeDigitNumber = Math.abs(_yNegativePeak).toString().length;
		if (positiveDigitNumber > negativeDigitNumber && (positiveDigitNumber - negativeDigitNumber != 1 || positiveLineCount != 10)) negativeLineCount = 1;
		else if (positiveDigitNumber < negativeDigitNumber && (negativeDigitNumber - positiveDigitNumber != 1 || negativeLineCount != 10)) positiveLineCount = 1;

		var peakInteval = _yPositivePeak - _yNegativePeak;
		if (_yNegativePeak != 0) {
			var negativeHeight = Math.abs(_yNegativePeak) / peakInteval * (height - 2 * _yMargin);
			_zeroLine = negativeHeight + _yMargin;
			var negativeInteval = negativeHeight / negativeLineCount;
			for (var i = 0; i < negativeLineCount; ++i) {
				var label = $('<span></span>');
				label.css({
					'position': 'absolute',
					'word-break': 'keep-all',
					'white-space': 'nowrap',
					'overflow': 'hidden',
					'width': _yLabelWidth,
					'font-size': 12,
					'bottom': _yMargin + i * negativeInteval,
					'color': '#aaaaaa'
				})
				label.text((negativeLineCount - i) * (_yNegativePeak / negativeLineCount));
				label.appendTo(_graph);
				var line = $('<div></div>');
				line.css({
					'position': 'absolute',
					'background-color': '#eeeeee',
					'width': width,
					'height': 1,
					'bottom': _yMargin + i * negativeInteval
				})
				line.appendTo(_graph);
			}
		}

		if (_yPositivePeak != 0) {
			var positiveHeight = Math.abs(_yPositivePeak) / peakInteval * (height - 2 * _yMargin);
			var positiveInteval = positiveHeight / positiveLineCount;
			for (var i = 0; i <= positiveLineCount; ++i) {
				var label = $('<span></span>');
				label.css({
					'position': 'absolute',
					'word-break': 'keep-all',
					'white-space': 'nowrap',
					'overflow': 'hidden',
					'width': _yLabelWidth,
					'font-size': 12,
					'bottom': _zeroLine + i * positiveInteval,
					'color': '#aaaaaa'
				})
				label.text(i * (_yPositivePeak / positiveLineCount));
				label.appendTo(_graph);
				var line = $('<div></div>');
				line.css({
					'position': 'absolute',
					'background-color': '#eeeeee',
					'width': width,
					'height': 1,
					'bottom': _zeroLine + i * positiveInteval
				})
				line.appendTo(_graph);
			}
		}
	}

	function drawXAsix(){
		var xInteval = 20;
		var xLabelHeight = 17;
		var xCount = xAsix.length;
		_xColumnWidth = (width - 2 * _xMargin - _yLabelWidth - (xCount - 1) * xInteval) / xCount;
		for (var i = 0; i < xCount; ++i){
			var label = $('<span></span>');
			var labelBottom = 0;
			if (yAsix[i] >= 0) labelBottom = _zeroLine - xLabelHeight;
			else labelBottom = _zeroLine;
			label.css({
				'position': 'absolute',
				'word-break': 'keep-all',
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'width': _xColumnWidth,
				'height': xLabelHeight,
				'font-size': 12,
				'bottom': labelBottom,
				'left': _yLabelWidth + _xMargin + i * (_xColumnWidth + xInteval),
				'color': '#000000',
				'text-align': 'center'
			})
			label.text(xAsix[i]);
			label.appendTo(_graph);

			var bar = $('<div></div>');
			var barHeight = 0;
			if (yAsix[i] >= 0) barHeight = yAsix[i] / _yPositivePeak * (height - _zeroLine - _yMargin);
			else barHeight = yAsix[i] / _yNegativePeak * (_zeroLine - _yMargin);
			
			bar.addClass('histogramBar');
			bar.attr('id', name + '_' + i);
			bar.css({
				'position': 'absolute',
				'left': _yLabelWidth + _xMargin + i * (_xColumnWidth + xInteval),
				'background-color': color,
				'width': _xColumnWidth,
				'height': 0,
				'-webkit-transition': 'height 1s',
				'cursor': 'pointer'
			})
			if (yAsix[i] >= 0){
				bar.css({
					'bottom': _zeroLine
				})
			} else {
				bar.css({
					'top': height + _legendHeight + _legendMarginBottom - _zeroLine
				})
			}
			bar.appendTo(_graph);
			bar.height(barHeight);

			var exp = $('<div></div>');
			var expBottom = 0;
			if (yAsix[i] >= 0) expBottom = _zeroLine + barHeight;
			else expBottom = _zeroLine - barHeight - xLabelHeight;
			exp.css({
				'position': 'absolute',
				'height': xLabelHeight,
				'font-size': 12,
				'text-align': 'center',
				'bottom': expBottom,
				'left': _yLabelWidth + _xMargin + i * (_xColumnWidth + xInteval),
				'color': '#000000'
			})
			exp.text(numberWithCommas(yAsix[i]));
			if (yAsix[i] != 0) exp.appendTo(_graph);
			var expWidth = exp.width();
			exp.css('left', _yLabelWidth + _xMargin + i * (_xColumnWidth + xInteval) - (expWidth / 2 - _xColumnWidth / 2));
		}
	}

	function eventBinding(){
		target.on('mouseenter', '.histogramBar', function(e){
			var id = parseInt($(this).attr('id').split('_')[1]);
			var posX = $(this).offset().left - _graph.offset().left + _xColumnWidth;
			var posY = e.pageY - _graph.offset().top;
			_hoverZone.css({
				'display': 'block',
				'top': posY,
				'left': posX
			})

			var y = yAsix[id];
			var x = xAsix[id];
			var xLabel = $('<div></div>');
			xLabel.css({
				'word-break': 'keep-all',
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'margin-left': 5,
				'margin-top': 5,
				'font-size': 12,
				'color': 'white'
			})
			xLabel.text(x);
			xLabel.appendTo(_hoverZone);
			var yLabel = $('<div></div>');
			yLabel.css({
				'word-break': 'keep-all',
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'margin-left': 5,
				'margin-right': 5,
				'font-size': 14,
				'color': _hoverColor
			})
			yLabel.text(legend + ': ' + numberWithCommas(y));
			yLabel.appendTo(_hoverZone);
			$(this).css('background-color', _hoverColor);
		})

		target.on('mouseleave', '.histogramBar', function(){
			_hoverZone.empty();
			_hoverZone.hide();
			$(this).css('background-color', color);
		})
		target.on('click', '.histogramBar', function(){
			var id = parseInt($(this).attr('id').split('_')[1]);
			clickEvent(id);
		})
	}



	this._render = function(){
		var allZero = true;
		for (var i = 0; i < yAsix.length; ++i) {
			if (yAsix[i] != 0) {
				allZero = false;
				break;
			}
		}
		if (!allZero) {
			initGraph();
			drawLegend();
			drawYAsix();
			drawXAsix();
			eventBinding();
		} else {
			target.append('No valid data');
		}
	}
}


Histogram.prototype.render = function(){
	this._render();
}


/**
config: {
	name: string
	target: jQuery Object,
	height: int,
	width: int,
	legend: string,
	clickEvent: function, 
	data:[{
		label: string,
		value: int,
		color: string
	}]
}
*/

function PieChart(config) {
	var name = (config.name) ? config.name : '';
	var target = (config.target) ? config.target : $(document);
	var height = (config.height) ? config.height : 600;
	var width = (config.width) ? config.width : 600;
	var legend = (config.legend) ? config.legend : '';
	var clickEvent = (config.clickEvent) ? config.clickEvent : function(){console.log('clicked')};
	var data = (config.data) ? config.data : [];

	var _graph = $('<div></div>');
	var _xMargin = 100;
	var _yMargin = 100;
	var _canvas = $('<canvas id=' + name + 'Canvas></canvas>');
	var _selected = -1;
	var _hoverZone = $('<div></div>');
	var _first = true;

	var _timeInteval = 12;
	var _timer;
	var _timerCurrDraw = 0;

	var _hoveredArea = -1;

	function initGraph(){
		_graph.css({
			'width': width,
			'height': height,
			'position': 'relative'
		})
		_graph.appendTo(target);

		_canvas.appendTo(_graph);
		_canvas = document.getElementById(name + 'Canvas');
		_canvas.width = width;
		_canvas.height = height;

		_hoverZone.css({
			'position': 'absolute',
			'display': 'none',
			'background-color': 'black',
			'color': 'white',
			'opacity': 0.8,
			'z-index': 10,
			'font-size': 12,
			'border-radius': 5,
			'border': '2px solid white',
			'min-width': 70,
			'height': 65,
			'top': 0,
			'left': 0
		})
		_hoverZone.appendTo(_graph );
	}

	function clearCanvas(){
		var c = _canvas.getContext('2d');
		_selected = -1;
		_hoveredArea = -1;
		c.clearRect(0, 0, width, height);
		_hoverZone.empty();
	}
	
	function drawPie(x, y){
		clearCanvas();
		var centerX = width / 2;
		var centerY = height / 2;
		var radius = (centerX - _xMargin) < (centerY - _yMargin) ? (centerX - _xMargin) : (centerY - _yMargin);
		var totalVal = 0;
		var startAngle = 0;
		var angles = [];
		for (var i = 0; i < data.length; ++i) totalVal += data[i].value;
		for (var i = 0; i < data.length; ++i){
			var currData = data[i];
			var percentage = currData.value / totalVal;
			var endAngle = startAngle + percentage * 2 * Math.PI;
			var c = _canvas.getContext('2d');
			if (!_first){
				c.beginPath();
				c.moveTo(centerX, centerY);
				c.arc(centerX, centerY, radius, startAngle, endAngle);
				c.closePath();

				if (c.isPointInPath(x, y)) {
					_hoveredArea = i;
					c.fillStyle = Public.colorStep(currData.color, 8);
					c.strokeStyle = Public.colorStep(currData.color, 8);
					_selected = i;
					_hoverZone.show();
					_hoverZone.css({
						'top': y + 10,
						'left': x + 10,
						'border': '2px solid white'
					})
					var y = data[i].value;
					var x = data[i].label;
					var xLabel = $('<div></div>');
					xLabel.css({
						'word-break': 'keep-all',
						'white-space': 'nowrap',
						'overflow': 'hidden',
						'margin-left': 5,
						'margin-top': 5,
						'font-size': 12,
						'color': 'white'
					})
					xLabel.text(x);
					xLabel.appendTo(_hoverZone);
					var yLabel = $('<div></div>');
					yLabel.css({
						'word-break': 'keep-all',
						'white-space': 'nowrap',
						'overflow': 'hidden',
						'margin-left': 5,
						'margin-right': 5,
						'font-size': 14,
						'color': Public.colorStep(currData.color, 8)
					})
					yLabel.text(legend + ': ' + numberWithCommas(y));
					yLabel.appendTo(_hoverZone);
					var radio = $('<div></div>');
					radio.css({
						'word-break': 'keep-all',
						'white-space': 'nowrap',
						'overflow': 'hidden',
						'margin-left': 5,
						'margin-right': 5,
						'font-size': 12,
						'color': 'white',
					})
					radio.text('Percentage: ' + (percentage * 100).toFixed(1) + '%');
					radio.appendTo(_hoverZone);
				} else {
					c.fillStyle = currData.color;
					c.strokeStyle = currData.color;
				}
				c.fill();

				var linelength = radius + 30;
				var lineAngle = (startAngle + endAngle) / 2;
				var xDelta = linelength * Math.cos(lineAngle);
				var yDelta = linelength * Math.sin(lineAngle);
				c.beginPath();
				c.moveTo(centerX, centerY);
				c.lineTo(centerX + xDelta, centerY + yDelta);
				c.closePath();
				c.stroke();

				var labellength = linelength + 10;
				xDelta = labellength * Math.cos(lineAngle);
				yDelta = labellength * Math.sin(lineAngle);
				c.fillStyle = 'black';
				c.font = '12px';
				if (lineAngle > Math.PI / 2 && lineAngle < Math.PI * 3 / 2) c.textAlign = 'right';
				else c.textAlign = 'left';
				c.textBaseline = 'middle';
				if (lineAngle >= 0 && lineAngle < Math.PI) {
					c.fillText(currData.label, centerX + xDelta, centerY + yDelta);
					c.fillText(legend + ': ' + numberWithCommas(currData.value), centerX + xDelta, centerY + yDelta + 15);
				} else {
					c.fillText(currData.label, centerX + xDelta, centerY + yDelta - 15);
					c.fillText(legend + ': ' + numberWithCommas(currData.value), centerX + xDelta, centerY + yDelta);
				}
				
			} else {
				angles.push(endAngle);
			}
			
			startAngle = endAngle;
		}
		
		if (_first) {
			_timer = setInterval(drawPieAnimation, _timeInteval, angles, centerX, centerY, radius);
			
		}
	}

	function drawPieAnimation(angles, centerX, centerY, radius) {																																													
		var index = -1;
		for (var i = 0; i < angles.length; ++i) {
			if (angles[i] > _timerCurrDraw ) {
				index = i;
				break;
			}
		}
		if (index == -1){
			_first = false;
			clearInterval(_timer);
			drawPie(0, 0);
			return;
		} else {
			var color = data[index].color;
			var step = Math.PI * 2 / (1000 / _timeInteval);
			var endAngle = (_timerCurrDraw + step) <= angles[index] ? (_timerCurrDraw + step) : angles[index];
			var c = _canvas.getContext('2d');
			c.beginPath();
			c.moveTo(centerX, centerY);
			c.arc(centerX, centerY, radius, _timerCurrDraw, endAngle);
			c.closePath();
			c.strokeStyle = color;
			c.fillStyle = color;
			c.fill();
			c.stroke();
			_timerCurrDraw = endAngle;
			
		}
	}

	function eventBinding(){
		function moving(ev){
			if (!_first){
				drawPie(ev.pageX - $(_canvas).offset().left, ev.pageY - $(_canvas).offset().top);
				if (_selected != -1) $(_canvas).css('cursor', 'pointer');
				else {
					_hoverZone.hide();
					$(_canvas).css('cursor', 'default');
				}
			}
		}
		function clicked(ev){
			if (!_first){
				drawPie(ev.pageX - $(_canvas).offset().left, ev.pageY - $(_canvas).offset().top);
				if (_hoveredArea != -1) clickEvent(_hoveredArea);
			}
		}

		$(_canvas).mousemove(function(ev){
			moving(ev);
		})

		$(_canvas).click(function(ev){
			clicked(ev);
		})

		_hoverZone.mousemove(function(ev){
			moving(ev);
		})

		_hoverZone.click(function(ev){
			clicked(ev);
		})
	}

	this._render = function(){
		initGraph();
		drawPie(0, 0);
		eventBinding();
	}
}

PieChart.prototype.render = function(){
	this._render();
}


 

/**
config: {
	name: string
	target: jQuery Object,
	height: int,
	width: int,
	group: [{
		x: float,
		y: float,
		label: string,
		color: string
	}]
	clickEvent: function, 
	data:[{
		x: float,
		y: float,
		info: string
	}],
	meaning: {
		x: string,
		y: string,
		xRate: bool,
		yRate: bool
	},
	zones: {
		lt: string,
		ltexp: string,
		rt: string,
		rtexp: string,
		lb: string,
		lbexp: string,
		rb: string,
		rbexp: string
	}
}
*/

function Scatter(config) {
	var name = (config.name) ? config.name : '';
	var target = (config.target) ? config.target : $(document);
	var height = (config.height) ? config.height : 600;
	var width = (config.width) ? config.width : 600;
	var group = (config.group) ? config.group : [];
	var clickEvent = (config.clickEvent) ? config.clickEvent : function(){};
	var data = (config.data) ? config.data : [];
	var meaning = (config.meaning) ? config.meaning : {};
	var zones = (config.zones)? config.zones : {};

	var _graph = $('<div id="scatter' + name + '"></div>');

	var _legendWidth = 100;
	var _graphCenterX = 0;
	var _graphCenterY = 0;
	var _graphScaleX = 1;
	var _graphScaleY = 1;
	var _centerX = (width - _legendWidth) / 2;
	var _centerY = height / 2;
	var _pointsInfo = [];
	var _hoverZone = $('<div></div>');

	var _maxRadius = 30;
	var _minRadius = 10;

	var _originalGroup = [];

	function initGraph(){
		_graph.css({
			'width': width,
			'height': height,
			'position': 'relative'
		})
		_graph.appendTo(target);

		_hoverZone.css({
			'position': 'absolute',
			'display': 'none',
			'background-color': 'black',
			'color': 'white',
			'opacity': 0.8,
			'z-index': 10,
			'font-size': 12,
			'border-radius': 5,
			'min-width': 70,
			'min-height': 50
		})
		_hoverZone.appendTo(_graph);

		var totalX = 0;
		var totalY = 0;
		var maxX = -10000000;
		var minX = 10000000;
		var maxY = -10000000;
		var minY = 10000000;
		// why it is group instead of data ? Bug ?
		for (var i = 0; i < group.length; ++i) {
			_originalGroup.push({
				'x': group[i].x,
				'y': group[i].y
			})
			totalX += group[i].x;
			totalY += group[i].y;
			if (group[i].x > maxX) maxX = group[i].x;
			if (group[i].x < minX) minX = group[i].x;
			if (group[i].y > maxY) maxY = group[i].y;
			if (group[i].y < minY) minY = group[i].y;
		}
		_graphScaleX = (width - _legendWidth) / (maxX - minX) * (1 - _maxRadius * 4 / (width - _legendWidth));
		_graphScaleY = height / (maxY - minY) * (1 - _maxRadius * 4 / height);
		_graphCenterX = totalX / (group.length);
		_graphCenterY = totalY / (group.length);
	}

	function knnOrNot(knn) {
		var pointCount = [];
		for (var i = 0; i < group.length; ++i) {
			pointCount.push(1);
		}
		for (var i = 0; i < data.length; ++i) {
			var minDis = 100000000;
			var point = data[i];
			var minIndex = -1;
			for (var j = 0; j < group.length; ++j) {
				var dis = Math.sqrt(Math.pow((point.x - group[j].x), 2) + Math.pow((point.y - group[j].y), 2));
				if (dis < minDis) {
					minDis = dis;
					minIndex = j;
				}
			}
			if (knn) {
				pointCount[minIndex] += 1;
				group[minIndex].x = (group[minIndex].x + point.x) / pointCount[minIndex];
				group[minIndex].y = (group[minIndex].y + point.y) / pointCount[minIndex];
			}
			_pointsInfo.push({
				'belong': minIndex
			})
		}
	}

	function drawAsix(){
		for (var i = 20; i < width - _legendWidth; i += 100) {
			var xAsix = $('<div></div>');
			xAsix.css({
				'position': 'absolute',
				'height': height,
				'width': 1,
				'background-color': '#fafafa',
				'top': 0,
				'left': i
			})
			xAsix.appendTo(_graph)
		}

		for (var i = 20; i < height; i += 100) {
			var yAsix = $('<div></div>');
			yAsix.css({
				'position': 'absolute',
				'height': 1,
				'width': width - _legendWidth,
				'background-color': '#fafafa',
				'top': i,
				'left': 0
			})
			yAsix.appendTo(_graph)
		}

		var xLowLabel = $('<div></div>');
		xLowLabel.css({
			'position': 'absolute',
			'height': _maxRadius,
			'width': (width - _legendWidth) / 2,
			'top': 0,
			'left': (width - _legendWidth) / 4 - (width - _legendWidth) / 2 / 2,
			'text-align': 'center',
			'color': '#666666'
		})
		xLowLabel.html('<strong>Low</strong> ' + meaning.x);
		xLowLabel.appendTo(_graph);
		var xHighLabel = $('<div></div>');
		xHighLabel.css({
			'position': 'absolute',
			'height': _maxRadius,
			'width': (width - _legendWidth) / 2,
			'top': 0,
			'left': (width - _legendWidth) / 4 * 3 - (width - _legendWidth) / 2 / 2,
			'text-align': 'center',
			'color': '#666666'
		})
		xHighLabel.html('<strong>High</strong> ' + meaning.x);
		xHighLabel.appendTo(_graph);

		var yLowLabel = $('<div></div>');
		yLowLabel.css({
			'position': 'absolute',
			'height': height / 2,
			'width': _maxRadius,
			'top': height / 4 - height / 2 / 2,
			'left': 0,
			'text-align': 'center',
			'color': '#666666',
			'-webkit-writing-mode': 'vertical-lr'
		})
		yLowLabel.html('<strong>Low</strong> ' + meaning.y);
		yLowLabel.appendTo(_graph);
		var yHighLabel = $('<div></div>');
		yHighLabel.css({
			'position': 'absolute',
			'height': height / 2,
			'width': _maxRadius,
			'top': height / 4 * 3 - height / 2 / 2,
			'left': 0,
			'text-align': 'center',
			'color': '#666666',
			'-webkit-writing-mode': 'vertical-lr'
		})
		yHighLabel.html('<strong>High</strong> ' + meaning.y);
		yHighLabel.appendTo(_graph);
	}

	function drawZones(){
		var leftTopZone = $('<div class="zones" id="zones_lt" data-toggle="tooltip" data-placement="top" title="' + zones.ltexp + '"></div>');
		leftTopZone.css({
			'position': 'absolute',
			'height': 40,
			'top': height / 4 - 20,
			'text-align': 'center',
			'color': '#dddddd',
			'font-weight': 900,
			'font-size': 30,
			'cursor': 'default'
		})
		leftTopZone.text(zones.lt);
		leftTopZone.appendTo(_graph);
		leftTopZone.css('left', (width - _legendWidth) / 4 - leftTopZone.width() / 2);
		var rightTopZone = $('<div class="zones" id="zones_rt" data-toggle="tooltip" data-placement="top" title="' + zones.rtexp + '"></div>');
		rightTopZone.css({
			'position': 'absolute',
			'height': 40,
			'top': height / 4 - 20,
			'text-align': 'center',
			'color': '#dddddd',
			'font-weight': 900,
			'font-size': 30,
			'cursor': 'default'
		})
		rightTopZone.text(zones.rt);
		rightTopZone.appendTo(_graph);
		rightTopZone.css('left', (width - _legendWidth) / 4 * 3 - rightTopZone.width() / 2);
		var leftBottomZone = $('<div class="zones" id="zones_lb" data-toggle="tooltip" data-placement="top" title="' + zones.lbexp + '"></div>');
		leftBottomZone.css({
			'position': 'absolute',
			'height': 40,
			'top': height / 4 * 3 - 20,
			'text-align': 'center',
			'color': '#dddddd',
			'font-weight': 900,
			'font-size': 30,
			'cursor': 'default'
		})
		leftBottomZone.text(zones.lb);
		leftBottomZone.appendTo(_graph);
		leftBottomZone.css('left', (width - _legendWidth) / 4 - leftBottomZone.width() / 2);
		var rightBottomZone = $('<div class="zones" id="zones_rb" data-toggle="tooltip" data-placement="top" title="' + zones.rbexp + '"></div>');
		rightBottomZone.css({
			'position': 'absolute',
			'height': 40,
			'top': height / 4 * 3 - 20,
			'text-align': 'center',
			'color': '#dddddd',
			'font-weight': 900,
			'font-size': 30,
			'cursor': 'default'
		})
		rightBottomZone.text(zones.rb);
		rightBottomZone.appendTo(_graph);
		rightBottomZone.css('left', (width - _legendWidth) / 4 * 3 - rightBottomZone.width() / 2);

	}


	function drawScatter(){
		var pointDis = [];
		for (var i = 0; i < group.length; ++i) {
			pointDis.push({
				'points': [],
			});
		}
		var maxColorStep = 1;
		for (var i = 0; i < data.length; ++i) {
			var point = data[i];
			var vector = [(point.x - _graphCenterX) * _graphScaleX, (point.y - _graphCenterY) * _graphScaleY];
			var x = _centerX + vector[0];
			var y = _centerY + vector[1];
			var minDis = 100000000;

			var belong = _pointsInfo[i].belong;
			var dis = Math.sqrt(Math.pow((point.x - _originalGroup[belong].x), 2) + Math.pow((point.y - _originalGroup[belong].y), 2));
			pointDis[belong].points.push({
				'index': i,
				'dis': dis
			})
			_pointsInfo[i].x = x;
			_pointsInfo[i].y = y;
		}
		for (var i = 0; i < pointDis.length; ++i) {
			var g = pointDis[i];
			g.points.sort(Public.compare('dis', 1));
			for (var j = 0; j < g.points.length; ++j) {
				var p = g.points[j];
				_pointsInfo[p.index].radius = _maxRadius - j * (_maxRadius - _minRadius) / g.points.length;
				_pointsInfo[p.index].color = Public.colorStep(group[i].color, 20 / g.points.length * j);
			}
		}
		for (var i = 0; i < _pointsInfo.length; ++i) {
			var point = _pointsInfo[i];
			var div = $('<div></div>');
			div.css({
				'position': 'absolute',
				'width': point.radius * 2,
				'height': point.radius * 2,
				'left': point.x,
				'top': point.y,
				'background-color': point.color,
				'border-radius': point.radius,
				'opacity': 0.7,
				'cursor': 'pointer'
			})
			div.addClass('point');
			div.attr('id', 'point_' + i);
			div.appendTo(_graph);
		}
		var legendTop = 0;
		for (var i = 0; i < group.length; ++i) {
			var legend = $('<div></div>');
			legend.css({
				'position': 'absolute',
				'left': width - _legendWidth,
				'top': legendTop,
				'width': _legendWidth,
			})
			var colorDiv = $('<div></div>');
			colorDiv.css({
				'width': 20,
				'height': 20,
				'background-color': group[i].color,
				'border-radius': 10,
				'opacity': 0.7,
				'float': 'left'
			})
			colorDiv.appendTo(legend);
			var textDiv = $('<div></div>');
			textDiv.css({
				'color': '#666666',
				'margin-left': '25px'
			})
			textDiv.text(group[i].label);
			textDiv.appendTo(legend);
			legend.appendTo(_graph);
			legendTop += legend.height() + 10;
		}
	}

	function eventBinding(){
		$("#scatter" + name).on('mouseenter', '.point', function(ev){
			var id = parseInt($(this).attr('id').split('_')[1]);
			var point = _pointsInfo[id];
			_hoverZone.show();
			_hoverZone.css({
				'left': point.x + 2 * point.radius,
				'top': point.y + point.radius,
				'border': '2px solid ' + point.color
			})
			var xLabel = $('<div></div>');
			xLabel.css({
				'word-break': 'keep-all',
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'margin-left': 5,
				'margin-right': 5,
				'margin-top': 5,
				'font-size': 12,
				'color': 'white'
			})
			var xText = '<strong>' + meaning.x + '</strong>: ';
			if (meaning.xRate) xText += (data[id].x * 100).toFixed(2) + '%';
			else xText += data[id].x
			xLabel.html(xText);
			xLabel.appendTo(_hoverZone);
			var yLabel = $('<div></div>');
			yLabel.css({
				'word-break': 'keep-all',
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'margin-left': 5,
				'margin-right': 5,
				'font-size': 12,
				'color': 'white'
			})
			var yText = '<strong>' + meaning.y + '</strong>: ';
			if (meaning.yRate) yText += (data[id].y * 100).toFixed(2) + '%';
			else yText += data[id].y
			yLabel.html(yText);
			yLabel.appendTo(_hoverZone);
			var info = $('<div></div>');
			info.css({
				'word-break': 'keep-all',
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'margin-left': 5,
				'margin-right': 5,
				'margin-bottom': 5,
				'font-size': 12,
				'color': 'white'
			})
			info.html(data[id].info);
			info.appendTo(_hoverZone);
		})

		$("#scatter" + name).on('mouseleave', '.point', function(){
			_hoverZone.empty();
			_hoverZone.hide();
		})

		$("#scatter" + name).on('click', '.point', function(){
			var id = $(this).attr('id').split('_')[1];
			clickEvent(parseInt(id));
		})
	}

	this._render = function(){
		initGraph();
		knnOrNot(false);
		drawAsix();
		drawZones();
		drawScatter();
		eventBinding();
		$('[data-toggle="tooltip"]').tooltip();
	}

	this._getPointsInfoInZone = function(zone){
		var res = [];
		for (var i = 0; i < group.length; ++i) res.push([]);
		for (var i = 0; i < _pointsInfo.length; ++i) {
			var test = false;
			if (zone == 1 && _pointsInfo[i].x < _centerX && _pointsInfo[i].y < _centerY) test = true;
			if (zone == 2 && _pointsInfo[i].x >= _centerX && _pointsInfo[i].y < _centerY) test = true;
			if (zone == 3 && _pointsInfo[i].x < _centerX && _pointsInfo[i].y >= _centerY) test = true;
			if (zone == 4 && _pointsInfo[i].x >= _centerX && _pointsInfo[i].y >= _centerY) test = true;
			if (test) {
				var point = data[i];
				var dis = Math.sqrt(Math.pow((point.x - _originalGroup[_pointsInfo[i].belong].x), 2) + Math.pow((point.y - _originalGroup[_pointsInfo[i].belong].y), 2));
				res[_pointsInfo[i].belong].push({
					'index': i,
					'dis': dis
				})
			}
		}
		for (var i = 0; i < res.length; ++i) {
			res[i].sort(Public.compare('dis', 1));
		}
		return res;
	}
}

Scatter.prototype.render = function(){
	this._render();
}

Scatter.prototype.getPointsInfoInZone = function(zone){
	return this._getPointsInfoInZone(zone);
}
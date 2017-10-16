/**
config: {
    name: string,
    target: jQuery Object,
    width: float,
    height: float,
    barHeight: float,
	extremum: {
        l: float,
        r: float
    },
    initial: {
        l: float, 
        r: float
    },
    beginDrag: function,
    endDrag: function
}
*/

function BiSlider(config) {
    var name = (config.name) ? config.name : '';
    var target = (config.target) ? config.target : $('<div></div>');
    var width = (config.width) ? config.width : 600;
    var height = (config.height) ? config.height : 50;
    var barHeight = (config.barHeight) ? config.barHeight : 30;
    var extremum = (config.extremum) ? config.extremum : {};
    var initial = (config.initial) ? config.initial : {};
    var beginDrag = (config.beginDrag) ? config.beginDrag : function(){};
    var endDrag = (config.endDrag) ? config.endDrag : function(){};

    var _graph = $('<div></div>');
    var _bar = $('<div></div>');
    var _validZone = $('<div></div>');
    var _left = $('<div></div>');
    var _right = $('<div></div>');
    var _leftLabel = $('<div></div>');
    var _rightLabel = $('<div></div>');
    var _leftVal = initial.l;
    var _rightVal = initial.r;
    var _leftSetValGroup = $('<div class="input-group">' + 
                            '<input type="number" class="form-control" placeholder="Value..." id="' + name + '_leftSetValInput">' + 
                            '<span class="input-group-btn">' + 
                            '<button class="btn btn-default" type="button" id="' + name + '_leftSetValButton">Sure</button>' + 
                            '</span>' + 
                        '</div>');
    var _rightSetValGroup = $('<div class="input-group">' + 
                        '<input type="number" class="form-control" placeholder="Value..." id="' + name + '_rightSetValInput">' + 
                        '<span class="input-group-btn">' + 
                        '<button class="btn btn-default" type="button" id="' + name + '_rightSetValButton">Sure</button>' + 
                        '</span>' + 
                    '</div>');

    function initGraph(){
        _graph.css({
            'position': 'relative',
            'width': width,
            'height': height
        })
        _graph.appendTo(target);
    }

    function drawBar() {
        _bar.css({
            'position': 'absolute',
            'width': width,
            'height': barHeight,
            'left': 0,
            'top': (height - barHeight) / 2,
            'background-color': '#DDE3FD',
            'border-radius': barHeight / 2,
            'z-index': -20
        })
        _bar.appendTo(_graph);
    }

    function drawLeftAndRight(){
        var interval = extremum.r - extremum.l;
        var leftPos = (initial.l - extremum.l) / interval * width;
        var rightPos = (initial.r - extremum.l) / interval * width;
        var labelWidth = 50;
        var labelHeight = 15;
        
        _validZone.css({
            'position': 'absolute',
            'width': rightPos - leftPos,
            'height': barHeight,
            'left': leftPos,
            'top': (height - barHeight) / 2,
            'background-color': '#798EF6',
            'z-index': -10
        })
        _validZone.appendTo(_graph);

        _left.css({
            'position': 'absolute',
            'height': barHeight * 2,
            'width': barHeight * 2,
            'left': leftPos - barHeight,
            'top': height / 2 - barHeight,
            'border-radius': barHeight,
            'background-color': '#FD4D0C',
            'cursor': 'pointer'
        })
        _left.attr('id', name + '_left');
        _left.appendTo(_graph);
        _leftLabel.css({
            'position': 'absolute',
            'word-break': 'keep-all',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'height': labelHeight,
            'width': labelWidth,
            'left': leftPos - labelWidth / 2,
            'top': height / 2 - barHeight - labelHeight,
            'text-align': 'center',
            'font-size': 12,
            'color': '#333333'
        })
        _leftLabel.attr('id', name + '_leftLabel');
        _leftLabel.text(initial.l);
        _leftLabel.appendTo(_graph);

        var leftDragging = false;
        _graph.on('mousedown', '#' + name + '_left', function(ev){
            var offset = ev.pageX - _bar.offset().left;
            leftDragging = true;
            beginDrag({
                l: _leftVal,
                r: _rightVal
            });
        })
        $(document).on('mousemove', function(ev){
            if (leftDragging) {
                var offset = ev.pageX - _bar.offset().left;
                var l = offset - barHeight;
                if (l < -barHeight) l = -barHeight;
                else if (l > rightPos - barHeight) l = rightPos - barHeight;
                leftPos = l + barHeight;
                _leftVal = extremum.l + (l + barHeight) / width * interval;
                $('#' + name + '_left').css('left', l);
                $('#' + name + '_leftLabel').css('left', l + barHeight - labelWidth / 2);
                $('#' + name + '_leftLabel').text(parseInt(_leftVal));
                _validZone.css({
                    'left': l + barHeight,
                    'width': rightPos - leftPos
                })
                _leftSetValGroup.remove();
            }
        }).on('mouseup', function(ev){
            if (leftDragging) endDrag({
                l: _leftVal,
                r: _rightVal
            });
            leftDragging = false;
        })
        _graph.on('dblclick', '#' + name + '_left', function(){
            _leftSetValGroup.appendTo(_graph)
            var groupHeight = _leftSetValGroup.height();
            var groupWidth = _leftSetValGroup.width();
            _leftSetValGroup.css({
                'position': 'absolute',
                'height': groupHeight,
                'width': groupWidth,
                'top': height / 2 - barHeight - groupHeight,
                'left': leftPos - groupWidth / 2
            })
            $('#' + name + '_leftSetValInput').val(parseInt(_leftVal));
        }).on('click', '#' + name + '_leftSetValButton', function(){
            var val = parseInt($('#' + name + '_leftSetValInput').val());
            if (!isNaN(val) && val >= extremum.l && val <= _rightVal) {
                _leftVal = val;
                leftPos = (_leftVal - extremum.l) / (extremum.r - extremum.l) * width;
                $('#' + name + '_left').css('left', leftPos - barHeight);
                $('#' + name + '_leftLabel').css('left', leftPos - labelWidth / 2);
                $('#' + name + '_leftLabel').text(parseInt(_leftVal));
                _validZone.css({
                    'left': leftPos,
                    'width': rightPos - leftPos
                })
                endDrag({
                    l: _leftVal,
                    r: _rightVal
                });
            }
            _leftSetValGroup.remove();
        })


        _right.css({
            'position': 'absolute',
            'height': barHeight * 2,
            'width': barHeight * 2,
            'left': rightPos - barHeight,
            'top': height / 2 - barHeight,
            'border-radius': barHeight,
            'background-color': '#FD4D0C',
            'cursor': 'pointer'
        })
        _right.attr('id', name + '_right');
        _right.appendTo(_graph);
        _rightLabel.css({
            'position': 'absolute',
            'word-break': 'keep-all',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'height': labelHeight,
            'width': labelWidth,
            'left': rightPos - labelWidth / 2,
            'top': height / 2 - barHeight - labelHeight,
            'text-align': 'center',
            'font-size': 12,
            'color': '#333333'
        })
        _rightLabel.attr('id', name + '_rightLabel')
        _rightLabel.text(initial.r);
        _rightLabel.appendTo(_graph);

        var rightDragging = false;
        _graph.on('mousedown', '#' + name + '_right', function(ev){
            var offset = ev.pageX - _bar.offset().left;
            rightDragging = true;
            beginDrag({
                l: _leftVal,
                r: _rightVal
            });
        })
        $(document).on('mousemove', function(ev){
            if (rightDragging) {
                var offset = ev.pageX - _bar.offset().left;
                var l = offset - barHeight;
                if (l < leftPos - barHeight) l = leftPos - barHeight;
                else if (l > width - barHeight) l = width - barHeight;
                rightPos = l + barHeight;
                _rightVal = extremum.l + (l + barHeight) / width * interval;
                $('#' + name + '_right').css('left', l);
                $('#' + name + '_rightLabel').css('left', l + barHeight - labelWidth / 2);
                $('#' + name + '_rightLabel').text(parseInt(_rightVal));
                _validZone.css({
                    'width': rightPos - leftPos
                })
                _rightSetValGroup.remove();
            }
        }).on('mouseup', function(ev){
            if (rightDragging) endDrag({
                l: _leftVal,
                r: _rightVal
            });
            rightDragging = false;
        })
        _graph.on('dblclick', '#' + name + '_right', function(){
            _rightSetValGroup.appendTo(_graph)
            var groupHeight = _rightSetValGroup.height();
            var groupWidth = _rightSetValGroup.width();
            _rightSetValGroup.css({
                'position': 'absolute',
                'height': groupHeight,
                'width': groupWidth,
                'top': height / 2 - barHeight - groupHeight,
                'left': rightPos - groupWidth / 2
            })
            $('#' + name + '_rightSetValInput').val(parseInt(_rightVal));
        }).on('click', '#' + name + '_rightSetValButton', function(){
            var val = parseInt($('#' + name + '_rightSetValInput').val());
            if (!isNaN(val) && val >= _leftVal && val <= extremum.r) {
                _rightVal = val;
                rightPos = (_rightVal - extremum.l) / (extremum.r - extremum.l) * width;
                $('#' + name + '_right').css('left', rightPos - barHeight);
                $('#' + name + '_rightLabel').css('left', rightPos - labelWidth / 2);
                $('#' + name + '_rightLabel').text(parseInt(_rightVal));
                _validZone.css({
                    'width': rightPos - leftPos
                })
                endDrag({
                    l: _leftVal,
                    r: _rightVal
                });
            }
            _rightSetValGroup.remove();
        })
    }

    this._render = function(){
        initGraph();
        drawBar();
        drawLeftAndRight();
    }
}

BiSlider.prototype.render = function() {
    this._render();
}
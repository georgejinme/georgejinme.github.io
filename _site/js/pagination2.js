/**
config: {
    name: string,
    target: jQuery.Object,
    data: [],
    maxNumberOfButton: int,
    eachPageNumber: int,
    clickEvent: function
}
*/

function Pagination(config) {
    var name = (config.name) ? config.name : '';
    var target = (config.target) ? config.target : $(document);
    var data = (config.data) ? config.data : [];
    var maxNumberOfButton = (config.maxNumberOfButton) ? config.maxNumberOfButton : 5;
    var eachPageNumber = (config.eachPageNumber) ? config.eachPageNumber : 10;
    var clickEvent = (config.clickEvent) ? config.clickEvent : function(){};

    var _currPage = 1;
    var _showingNumbers = [];
    var _numberOfShowedButton = 0;
    var _totalPages = 0;
    var _paginator;

    function initPagination(){
        _paginator = $('<nav aria-label="Page navigation"></nav>');
        _paginator.append('<ul class="pagination" id="' + name + '_pagination"></ul>');
        _paginator.appendTo(target);
        var leftArrow = '<li id="' + name + '_left"><a href="javascript:void(0);" aria-label="Previous">' + 
                            '<span aria-hidden="true">&laquo;</span>' + 
                        '</a></li>'
        $('#' + name + '_pagination').append(leftArrow);
        var rightArrow = '<li id="' + name + '_right"><a href="javascript:void(0);" aria-label="Next">' + 
                            '<span aria-hidden="true">&raquo;</span>' + 
                        '</a></li>'
        $('#' + name + '_pagination').append(rightArrow);
        _totalPages = Math.ceil(data.length / eachPageNumber);
        _numberOfShowedButton = (maxNumberOfButton > _totalPages) ? _totalPages : maxNumberOfButton;
        for (var i = 1; i <= _numberOfShowedButton; ++i) {
            _showingNumbers.push(i);
        }
    }

    function drawNumber(){
        $('.' + name + '_number').remove();
        for (var i = _showingNumbers.length - 1; i >= 0; --i) {
            var number = _showingNumbers[i];
            $('#' + name + '_left').after('<li class="' + name + '_number" id="' + name + '_' + number + '"><a href="javascript:void(0);">' + number + '</a></li>');
        }
        $('#' + name + '_' + _currPage).addClass('active');
        if (_currPage <= 1) $('#' + name + '_left').addClass('disabled');
        else $('#' + name + '_left').removeClass('disabled');
        if (_currPage >= _totalPages) $('#' + name + '_right').addClass('disabled');
        else $('#' + name + '_right').removeClass('disabled');
    }

    function pageClick(page) {
        _currPage = page;
        if (_numberOfShowedButton != _totalPages) {
            _showingNumbers = [];
            var mid = parseInt(_numberOfShowedButton / 2);
            var low = 0;
            var high = 0;
            if (page >= 1 && page <= mid) {
                low = 1;
                high = _numberOfShowedButton;
            } else if (page <= _totalPages && page >= _totalPages - mid + 1) {
                low = _totalPages - _numberOfShowedButton + 1;
                high = _totalPages;
            } else {
                if (_numberOfShowedButton % 2 == 0) {
                    low = page - mid;
                    high = page + mid - 1;
                } else {
                    low = page - mid;
                    high = page + mid;
                }
            }
            for (var i = low; i <= high; ++i) {
                _showingNumbers.push(i);
            }
        }
        drawNumber();
        var lowIndex = (_currPage - 1) * eachPageNumber;
        var highIndex = (_currPage == _totalPages) ? data.length - 1 : _currPage * eachPageNumber - 1;
        var currData = [];
        for (var i = lowIndex; i <= highIndex; ++i) {
            currData.push(data[i]);
        }
        clickEvent(currData);
    }

    function bindClickEvent(){
        $('#' + name + '_pagination').on('click', '.' + name + '_number', function(){
            var page = parseInt($(this).attr('id').split('_')[1]);
            pageClick(page);
        })
        $('#' + name + '_pagination').on('click', '#' + name + '_left', function(){
            if (!$(this).hasClass('disabled')) pageClick(_currPage - 1);
        })
        $('#' + name + '_pagination').on('click', '#' + name + '_right', function(){
            if (!$(this).hasClass('disabled')) pageClick(_currPage + 1);
        })
    }

    this._render = function(){
        initPagination();
        drawNumber();
        bindClickEvent();
        if (data.length == 0) clickEvent(data);
        else $('#' + name + '_1').click();
    }
}

Pagination.prototype.render = function(){
    this._render();
}
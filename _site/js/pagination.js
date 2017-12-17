var totalPages = 0;
var currentPage = 1;
var visiblePagination = [];

function setPagination(curr){
    if (curr < 1 || curr > totalPages) return;
    currentPage = curr;
    $(".pagination li").removeClass("active");
    if (totalPages <= 5){
        $("#pagination" + curr).addClass("active");
        if (curr == 1) $("#left").addClass("disabled");
        else if (curr == totalPages) $("#right").addClass("disabled");
        else {
            $("#left").removeClass("disabled");
            $("#right").removeClass("disabled");
        }
    } else {
        if (curr <= 2){
            $("#pagination" + curr).addClass("active");
            if (curr == 1) $("#left").addClass("disabled");
            visiblePagination = [1, 2, 3, 4, 5];
        } else if (curr >= (totalPages - 1)){
            $("#pagination" + (5 - (totalPages - curr))).addClass("active");
            if (curr == totalPages) $("#right").addClass("disabled");
            visiblePagination = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            $("#pagination3").addClass("active");
            $("#left").removeClass("disabled");
            $("#right").removeClass("disabled");
            visiblePagination = [curr - 2, curr - 1, curr, curr + 1, curr + 2];
        }
    }
    for (var i = 1; i <= visiblePagination.length; ++i){
        $("#pagination" + i + " a").text(visiblePagination[i - 1]);
    }
}

function bindPaginationEvent(func){
    $(".pagination li").click(function(ev){
        $(".tab-content").scrollTop(0)
        var id = $(ev.target).parent().attr("id");
        var val = parseInt(ev.target.innerText)
        if (id == "left") setPagination(currentPage - 1);
        else if (id == "right") setPagination(currentPage + 1);
        else setPagination(val);
        func();
    });
}

function initPagination(number, func){
    if (number == 0) return;
    visiblePagination = [];
    currentPage = 1;
    var pages = Math.ceil(number / 5);
    totalPages = pages;
    if (pages > 5) {
        visiblePagination = [1, 2, 3, 4, 5];
    } else {
        for (var i = 1; i <= pages; ++i){
            visiblePagination.push(i);
        }
    }
    $(".pagination").append("<li class=\"disabled\" id=\"left\"><a href=\"javascript:void(0);\">&laquo;</a></li>")
    for (var i = 1; i <= visiblePagination.length; ++i){
        $(".pagination").append("<li id=\"pagination" + i + "\"><a href=\"javascript:void(0);\">" + visiblePagination[i - 1] + "</a></li>")
    }
    $(".pagination").append("<li class=\"disabled\" id=\"right\"><a href=\"javascript:void(0);\">&raquo;</a></li>")
    if (pages >= 1) $("#pagination" + currentPage).addClass("active");
    if (pages > 1) $("#right").removeClass("disabled");
    bindPaginationEvent(func);
}
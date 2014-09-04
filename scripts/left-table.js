$(function(){
    $("#tasks")
        .treetable({ 
            column: 1,
            expandable: true
        })
        .resizableColumns()
        .editableTableWidget()
    $("#tasks th:first-child").css("width","1.49%");
    $("#tasks th:eq(1)").css("width","31%");
    $("#tasks th:eq(2)").css("width","14.7%");
    $("#tasks th:eq(3)").css("width","13.2%");
    $("#tasks th:eq(4)").css("width","11%");
    $("#tasks th:eq(5)").css("width","6.6%");

    $("#tasks td:first-child").on('click', function(e){
      window.ev = e;
      $(e.target.parentNode).toggleClass("selected");
    })
})
$(function(){
    $("#tasks")
        .treetable({ 
            column: 1,
            expandable: true
        })
        .resizableColumns()
        .editableTableWidget()

    $("#tasks td:first-child").on('click', function(e){
      window.ev = e;
      $(e.target.parentNode).toggleClass("selected");
    })
})
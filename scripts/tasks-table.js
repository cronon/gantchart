$(function(){
    $("#tasks")
        .treetable({ 
            column: 1,
            expandable: true,
            onNodeExpand: function() {
              console.log(this);
              window.rootNode = this
            }
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
    });

    window.tasksTable = (function(){
      var getSelectedRow = function(){
        return $("#tasks .selected")
      }

      var getId = (function(){
        var lastId = 3;
        return function(){
          lastId +=1;
          return lastId;
        }
      })()

      var newRow = function(parentNode){
        var parentId = (parentNode || {id:""}).id;
        return "<tr data-tt-id=\""+getId() +"\" data-tt-parent-id=\""+ parentId + "\">" + 
          "<td></td><td>New task</td><td></td><td></td><td></td><td></td>"
      }

      return {
        insertRow: function(){
          var selected = getSelectedRow();
          var node = $("#tasks").treetable("node", selected.data().ttId);
          var parentNode = node.parentNode();
          $("#tasks").treetable("loadBranch", parentNode, newRow(parentNode));
        }
      }
    })()
})
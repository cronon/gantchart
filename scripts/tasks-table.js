$(function(){
    $("#tasks")
        .treetable({ 
            column: 1,
            expandable: true,
            onNodeCollapse: function(){
              this.children.forEach(function(child){
                child.row[0].classList.remove("selected");
              })
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
    $(".rc-handle:first-child").trigger("mousedown").trigger("mouseup")

    var selectOnClick = function(e){
      if($(e.target.parentNode).hasClass("selected")){
        $(".selected").toggleClass("selected");  
      } else {
        $(".selected").toggleClass("selected"); 
        $(e.target.parentNode).addClass("selected");
      }
      
    }
    $("#tasks").on('click', "td:first-child", selectOnClick);

    window.tasksTable = (function(){
      var getSelectedRow = function(){
        return $("#tasks .selected")
      }

      var getId = (function(){
        var lastId = 3;
        return function(){
          lastId += 1;
          return lastId;
        }
      })()

      var newRow = function(parentNode){
        var parentId = (parentNode || {id:""}).id;
        return "<tr data-tt-id=\""+getId() +"\" data-tt-parent-id=\""+ parentId + "\">" + 
          "<td></td><td>New task</td><td></td><td></td><td></td><td></td>"
      }

      var appendChild = function(parent){
        $("#tasks")
          .treetable("loadBranch", parentNode, newRow(parent))
          .editableTableWidget()
      }

      return {
        insertRow: function(){
          var selected = getSelectedRow();
          var parentNode = selected.length == 0 ? null : $("#tasks").treetable("node", selected.data().ttId).parentNode();
          appendChild(parentNode);
        },

        insertChild: function(){
          var selected = getSelectedRow();
          var node = selected.length == 0 ? null : $("#tasks").treetable("node", selected.data().ttId);
          appendChild(node);
        }
      }
    })()
})
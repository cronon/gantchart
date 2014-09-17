$(function(){

    var dataScheme = {
      "id": "",
      "name": "Task name",  //argued
      "duration": "Duration",
      "start": "Start",
      "end": "End",
      "predecessors": "Predecessors"
    };
    var rows = [
      {
        id: 1,
        name: "learn angualr",
        duration: "13 days",
        start: "today",
        end: "in 13 days",
        predecessors: 2,
        isValid: function(){
          return duration != "13 days" ? true : false
        }
      }
    ]

    $("#tasks").structuredTable(dataScheme, rows);

    window.tasksTable = (function(){
      var getSelectedRow = function(){
        return $("#tasks").structuredTable("getSelectedRow")
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
        var id = getId();
        return "<tr data-tt-id=\""+id+"\" data-tt-parent-id=\""+ parentId + "\">" + 
          "<td>"+id+"</td><td>New task</td><td></td><td></td><td></td><td></td>"
      }

      var appendChild = function(parent){
        $("#tasks")
          .treetable("loadBranch", parent, newRow(parent))
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
        },

        removeRow: function(){
          var selected = getSelectedRow();
          if(selected.length) {
            $("#tasks").treetable("removeNode", selected.data().ttId);
          }
        }
      }
    })()
})

console.log(1);

(function($){

  var getId = (function(){
    var lastId = 3;
    return function(){
      lastId += 1;
      return lastId;
    }
  })()

  var newRow = function(row, parentNode){
    var parentId = (parentNode || {id:""}).id;
    var id = getId();

    var result = "<tr data-tt-id=\""+id+"\" data-tt-parent-id=\""+ parentId + "\">";
    for(key in JSON.parse(JSON.stringify(row))){
      result += '<td>' + row[key] + '</td>';
    }
    result += '</tr>';
    return  result;
  }

  var appendChild = function(row, parent){
    this
      .treetable("loadBranch", parent, row)
      .editableTableWidget()
  }

  var newTHead = function(dataScheme){
    var result = "<thead>";
    for(k in dataScheme){
      result += '<th>' + dataScheme[k] + '</th>';
    }
    result += '</thead>';
    return result;
  }

  var methods = {
    init: function(dataScheme, rows){
      this.append(newTHead(dataScheme));

      dragtable.makeDraggable(this[0]);
      this.treetable({ 
            column: 1,
            expandable: true,
            onNodeCollapse: function(){
              this.children.forEach(function(child){
                child.row[0].classList.remove("st-selected");
              })
            }
        })
        .resizableColumns()
        .editableTableWidget()

      for(var key in rows){
        appendChild.call(this, newRow(rows[key]), null)
      };

      this.find("th:first-child").css("width","15px");
      $(".rc-handle:first-child").trigger("mousedown").trigger("mouseup")

      var selectOnClick = function(e){
        if($(e.target.parentNode).hasClass("st-selected")){
          $(".st-selected").toggleClass("st-selected");  
        } else {
          $(".st-selected").toggleClass("st-selected"); 
          $(e.target.parentNode).addClass("st-selected");
        }      
      }

      this.on('click', "td:first-child", selectOnClick);
    }

    ,getSelectedRow: function(){
      return this.find('.st-selected');
    }

  }


  $.fn.structuredTable = function(method, args){
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error("Method " + method + " does not exist on jQuery.structuredTable");
    }
  }

})(jQuery)
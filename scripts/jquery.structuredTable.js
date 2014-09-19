$(function(){

    var dataScheme = {
      "id": "",
      "name": "Task name",  //argued
      "duration": "Duration",
      "start": "Start",
      "end": "End",
      "predecessors": "Predecessors"
    };

    var RowsFactory = function(){
      var rows = [];

      var findRow = function(id){
        var result = null;
        rows.every(function(row){
          if(row.id == id){
            result = row;
            return false;
          } else {
            return true;
          }
        });
        if(result === null){
          throw new Error("row with id: " + id + " cannot be found");
        }
        return result;
      }

      var changeRow = function(id, attr, value){
        var row = findRow(id);
        if( (Math.floor(Math.random() * 10)) % 2 ){ // validation here
          $(document).trigger('rowChanged', [id, attr, value])
          row[attr] = value;
          return value;
        } else {
          return false;
        }
      }

      var self = function(id, attr, value){
        console.log(id, attr, value);
        if(arguments.length == 1){
          return findRow(id);
        } else if (arguments.length == 2) {
          return findRow(id)[attr];
        } else if (arguments.length == 3){
          return changeRow(id, attr, value); // it will notify table
        }
      }

      var getId = (function(){
        var lastId = 0;
        return function(){
          lastId += 1;
          return lastId;
        }
      })();

      self.appendChild = function(parentId, object){
        var newRow = $.extend({}, object);
        newRow.parentId = parentId;
        var id = getId();
        newRow.id = id;
        rows.push(newRow);
        $(document).trigger('childAppended', id);
        return id;
      }

      self.getRows = function(){
        return rows;
      }

      return self;
    }
    var rows = [
      {
        name: "learn angualr",
        duration: "13 days",
        start: "today",
        end: "in 13 days",
        predecessors: 2
      },
      {
        parentId: 1,
        name: "learn directives",
        duration: "1 day"
      }
    ];

    window.Rows = RowsFactory();
    rows.forEach(function(row){
      Rows.appendChild(row.parentId, row)
    })
    $("#tasks").structuredTable(dataScheme, window.Rows);

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
  "use strict";

  var newTr = function(scheme, row){
    var parentId = row.parentId;
    var id = row.id;

    var result = $("<tr data-tt-id=\""+id+"\" data-tt-parent-id=\""+ parentId + "\">");
    Object.keys(scheme).forEach(function(key){
      var value = row.hasOwnProperty(key) ? row[key] : '';

      var td = $('<td>' + value + '</td>');
      td.on('validate', function(e, newValue){
        return Rows(id, key, newValue);
      });

      result.append(td);
    })
    return  result;
  }

  var appendChild = function(row, parent){
    this.find("tbody").append(row)
  }

  var newTHead = function(dataScheme){
    var result = "<thead>";
    for(var k in dataScheme){
      result += '<th>' + dataScheme[k] + '</th>';
    }
    result += '</thead>';
    return result;
  }

  var findField = function(td, dataScheme){

  }

  var findTd = function(id, dataScheme, attr){
    var tr = self.find("tr[data-tt-id=" + id + "]");
    var index = Object.keys(dataScheme).indexOf(attr);
    debugger;
    return $(tr.find("td")[index]);
  }

  var rowChangedHandler = function(dataScheme){
    return function(e, id, attr, value){
      var td = findTd(id, dataScheme, attr);
      debugger;
      td.contents().filter(function() {
        return this.nodeType == 3;
      })[0].nodeValue = value;
    }
  }
  var Rows, self;
  var methods = {
    init: function(dataScheme, RowsModel){
      Rows = RowsModel;
      self = this;

      this.append(newTHead(dataScheme));
      this.append("<tbody></tbody>");

      Rows.getRows().forEach(function(row){
        var tr = newTr(dataScheme, row)
        self.find("tbody").append(tr)
      });

      $(document).on('rowChanged', rowChangedHandler(dataScheme));
      dragtable.makeDraggable(this[0]);
      this.treetable({ 
            column: 1, // need to be a variable
            expandable: true,
            onNodeCollapse: function(){
              this.children.forEach(function(child){
                child.row[0].classList.remove("st-selected");
              })
            }
        })
        .resizableColumns()
        .editableTableWidget()

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
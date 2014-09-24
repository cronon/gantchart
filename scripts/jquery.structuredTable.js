$(function(){
  "use strict";
  var colDefinition = function(field, column, expandable){
    return {
      "field": field,
      "column": column,
      "expandable": expandable || false
    }
  }
  var dataScheme = [
    colDefinition("id", ""),
    colDefinition("name", "Task name", true), 
    colDefinition("duration", "Duration"),
    colDefinition("start", "Start"),
    colDefinition("end", "End"),
    colDefinition("predecessors", "Predecessors")
  ];
  dataScheme.expandableColumn = 1;

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
        $(document).trigger('rowChange', [id, attr, value])
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
      $(document).trigger('childAppend', id);
      return id;
    }

    var getChildren = function(id){
      return rows.filter(function(row){
        return row.parentId == id;
      })  
    }

    var removeOneRow = function(id){
      var row = self(id);
      var index = rows.indexOf(row);
      $(document).trigger('rowRemove', id);
      return rows.splice(index, 1);
    }

    self.removeRow = function(id){
      var children = getChildren(id);
      children.forEach(function(child){
        self.removeRow(child.id);
      });
      return removeOneRow(id);
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
  });
  $("#tasks").structuredTable(dataScheme, window.Rows, 1);

})

console.log(1);

(function($){
  "use strict";

  var newTr = function(scheme, row){
    var parentId = row.parentId;
    var id = row.id;

    var result = $("<tr data-tt-id=\""+id+"\" data-tt-parent-id=\""+ parentId + "\">");
    scheme.map(function(c){
      return c.field;
    }).forEach(function(key){
      var value = row.hasOwnProperty(key) ? row[key] : '';

      var td = $('<td>' + value + '</td>');
      td.on('validate', function(e, newValue){
        return Rows(id, key, newValue);
      });

      result.append(td);
    })
    return  result;
  }

  var newTHead = function(dataScheme){
    var result = "<thead>";
    dataScheme.forEach(function(col){
      result += '<th>' + col.column + '</th>';
    });
    result += '</thead>';
    return result;
  }

  var findTd = function(id, dataScheme, attr){
    var tr = self.find("tr[data-tt-id=" + id + "]");
  var index = dataScheme.map(function(c){
              return c.field;
            }).indexOf(attr);
    return $(tr.find("td")[index]);
  }

  var childAppendHandler = function(dataScheme){
    return function(e, id){
      var row = Rows(id);
      var parentNode =  row.parentId ? self.treetable("node", row.parentId) : null;
      self.treetable("loadBranch", parentNode, newTr(dataScheme, row))
        .editableTableWidget()
    }
  }

  var rowChangeHandler = function(dataScheme){
    return function(e, id, attr, value){
      var td = findTd(id, dataScheme, attr);
      td.contents().filter(function() {
        return this.nodeType == 3;
      })[0].nodeValue = value;
    }
  }

  var isOnlyChild = function(node){
    var parent = node.parentNode() || {children: false};
    return !!parent.children;
  }
  var rowRemoveHandler = function(e, id){
    var node = self.treetable("node", id);
    self.treetable("unloadBranch", node);
    if(isOnlyChild(node)){
      self.treetable("unloadBranch", node.parentNode());
    } else {
      self.treetable("removeNode", id);
    }
  }

  var columnMoveHandler = function(){
    return function(e){
      var was = e.originalEvent.detail.was;
      var became = e.originalEvent.detail.became;
      var replaced = dataScheme.splice(was, 1)[0];
      dataScheme.splice(became, 0, replaced);

      var clone = self.removeChildren().clone();
      var parent = self.parent();
      self.remove();
      parent.append(clone);
      self = clone;
      makeDOM(dataScheme, Rows);
    }
  }

  var selectOnClick = function(e){
    if($(e.target.parentNode).hasClass("st-selected")){
      $(".st-selected").toggleClass("st-selected");  
    } else {
      $(".st-selected").toggleClass("st-selected"); 
      $(e.target.parentNode).addClass("st-selected");
    }      
  }

  var getExpandableIndex = function(dataScheme){
    // debugger;
    return dataScheme.map(function(item, index){
      if(item.expandable){
        return true;
      } else {
        return false;
      }
    }).indexOf(true);
  }
  var makeDOM = function(dataScheme, RowsModel){
    self.append(newTHead(dataScheme));
    self.append("<tbody></tbody>");

    Rows.getRows().forEach(function(row){
      var tr = newTr(dataScheme, row)
      self.find("tbody").append(tr)
    });

    dragtable.makeDraggable(self[0]);
    self.treetable({ 
          column: getExpandableIndex(dataScheme),
          expandable: true,
          onNodeCollapse: function(){
            this.children.forEach(function(child){
              child.row[0].classList.remove("st-selected");
            })
          }
      })
      .resizableColumns()
      .editableTableWidget()
  }
  var Rows, self, dataScheme;
  var methods = {
    init: function(_dataScheme, RowsModel){
      Rows = RowsModel;
      self = this;
      dataScheme = _dataScheme;

      makeDOM(dataScheme, RowsModel);

      $(document).on('rowChange', rowChangeHandler(dataScheme));
      $(document).on('childAppend', childAppendHandler(dataScheme));
      $(document).on('rowRemove', rowRemoveHandler);
      $(document).on('dt-columnmove', columnMoveHandler(dataScheme))
      this.on('click', "td:first-child", selectOnClick);

      //this.find("th:first-child").css("width","15px");
      $(".rc-handle:first-child").trigger("mousedown").trigger("mouseup")

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
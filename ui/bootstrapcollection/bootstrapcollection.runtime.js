/* global TW */
TW.Runtime.Widgets.bootstrapcollection = function () {
  var thisWidget = this;
  var uid = new Date().getTime() + "_" + Math.floor(1000 * Math.random());
  var selectedIndices = [];
  var previousPosition = [];

  this.runtimeProperties = function () {
    return {
      'supportsAutoResize': true,
      'needsDataLoadingAndError': false
    };
  };

  this.renderHtml = function () {
    var html =
            '<div class="widget-content widget-bootstrapcollection bootstrapcollection_' + uid + '">' +
            '  <div class="bootstrapcollection_' + uid + '_header col-sm-12"></div>' +
            '  <div class="bootstrapcollection_' + uid + '_collection col-sm-12"></div>' +
            '  <div class="bootstrapcollection_' + uid + '_footer col-sm-12"></div>' +
            '</div>';
    return html;
  };

  this.afterRender = function () {
    var debugMode = thisWidget.getProperty('debugMode');

    $('.bootstrapcollection_' + uid).scroll(function () {
      var scrollTop = $('.bootstrapcollection_' + uid).scrollTop();
      if (debugMode) {
        console.log("BootstrapCollection - scroll - bootstrapcollection_" + uid + " - scrollTop = " + scrollTop);
      }
      previousPosition['bootstrapcollection_' + uid] = scrollTop;
    });

    updateHeaderFooter("header", "all");
    updateHeaderFooter("footer", "all");
  };

  this.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {
  };

  this.resize = function (width, height) {
  };

  this.serviceInvoked = function (serviceName) {
  };

  this.updateProperty = function (updatePropertyInfo) {
    switch (updatePropertyInfo.TargetProperty) {
      case "debugMode":
      case "scrollToSelected":
      case "scrollToPreviousPosition":
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
        break;
      case "headerMashup":
      case "headerData":
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
        updateHeaderFooter("header", "mashup");
        break;
      case "headerHeight":
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
        updateHeaderFooter("header", "height");
        break;
      case "footerMashup":
      case "footerData":
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
        updateHeaderFooter("footer", "mashup");
        break;
      case "footerHeight":
        this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
        updateHeaderFooter("footer", "height");
        break;
      case "data":
        updateData(updatePropertyInfo.RawSinglePropertyValue);
        break;
    }
  };

  this.beforeDestroy = function () {
  };

  function updateHeaderFooter(suffix, type) {
    var mashup = thisWidget.getProperty(suffix + "Mashup");
    var height = thisWidget.getProperty(suffix + "Height");
    var data = thisWidget.getProperty(suffix + "Data");

    if (mashup && height) {
      switch (type) {
        case "all":
        case "mashup":
          $('.bootstrapcollection_' + uid + '_' + suffix).empty();
          $('.bootstrapcollection_' + uid + '_' + suffix).css("height", height);

          $("<div class='widget-bootstrapcollection-" + suffix + "'></div>").
                  css({"width": "100%", "height": "100%"}).
                  appendTo('.bootstrapcollection_' + uid + '_' + suffix).
                  mashup({
                    mashupName: mashup,
                    mashupParameters: data && data.rows && data.rows[0] ? data.rows[0] : undefined,
                    loaded: function (success, mashupJqEl) {
                    },
                    loadFail: function (message) {
                    },
                    gotSize: function (width, height) {
                    }
                  });
          break;
          break;
        case "height":
          $('.bootstrapcollection_' + uid + '_' + suffix).css("height", height);
          break;
      }
    } else {
      $('.bootstrapcollection_' + uid + '_' + suffix).empty();
    }
  }

  function updateData(data) {
    var oldData = thisWidget.getProperty('data');
    var debugMode = thisWidget.getProperty('debugMode');

    if (JSON.stringify(oldData) !== JSON.stringify(data)) {
      thisWidget.setProperty("data", data);

      selectedIndices = [];
      var selectedItems = TW.InfoTableUtilities.CloneInfoTable({
        "dataShape": data.dataShape,
        "rows": data.rows.filter(function (row, index) {
          if (row.mashup_selected) {
            selectedIndices.push(index);
          }
          return row.mashup_selected;
        })
      });
      thisWidget.setProperty("selectedItems", selectedItems);

      var clickedItem = TW.InfoTableUtilities.CloneInfoTable({
        "dataShape": data.dataShape,
        "rows": []
      });
      thisWidget.setProperty("clickedItem", clickedItem);

      var clickedDataItem = TW.InfoTableUtilities.CloneInfoTable({
        "dataShape": {fieldDefinitions: {}},
        "rows": []
      });
      for (var index = 0; index < data.rows.length; index++) {
        if (data.rows[index].mashup_data) {
          clickedDataItem = TW.InfoTableUtilities.CloneInfoTable({
            "dataShape": data.rows[index].mashup_data.dataShape,
            "rows": []
          });
        }
      }
      thisWidget.setProperty("clickedDataItem", clickedDataItem);

      $('.bootstrapcollection_' + uid + '_collection').empty();

      var rootIndices = [];
      var roots = data.rows.filter(function (row, index) {
        if (!row.parent_uid) {
          rootIndices.push(index);
        }
        return !row.parent_uid;
      });
      for (var index = 0; index < roots.length; index++) {
        addNode(roots[index], rootIndices[index], data.rows, '.bootstrapcollection_' + uid + '_collection', data.dataShape, debugMode);
      }

      if (thisWidget.getProperty("scrollToSelected")) {
        var selected = roots.findIndex(function (row) {
          return row.mashup_selected;
        });
        if (selected !== -1) {
          var scrollTop = $('.bootstrapcollection_' + uid + '_collection').children("div").eq(selected).offset().top;
          $('.bootstrapcollection_' + uid).scrollTop(scrollTop);

        }
      }

      if (thisWidget.getProperty("scrollToPreviousPosition") && previousPosition['bootstrapcollection_' + uid]) {
        $('.bootstrapcollection_' + uid).scrollTop(previousPosition['bootstrapcollection_' + uid]);
      }
    }
  }

  function addNode(row, rowIndex, rows, parent, dataShape, debugMode) {
    var rowUID = new Date().getTime() + "_" + Math.floor(1000 * Math.random());
    if (debugMode) {
      console.log("BootstrapCollection - addNode - rowUID = " + rowUID);
    }

    var container = $("<div class='widget-bootstrapcollection-container widget-bootstrapcollection-container-" + rowUID + "'></div>").
            addClass(row.bootstrap_class).
            appendTo(parent);

    if (row.is_mashup) {
      var extraBorder = row.mashup_selection_background || row.mashup_hover_background || row.mashup_active_background ? 20 : 0;
      container.css("height", ((row.mashup_folded_height ? row.mashup_folded_height : row.height) + extraBorder) + "px");

      if (row.mashup_selection_group) {
        container.addClass("widget-bootstrapcollection-container-selection-group-" + row.mashup_selection_group);
      }

      if (row.mashup_selected) {
        container.addClass("widget-bootstrapcollection-container-" + rowUID + "-selected");
      }

      var style =
              (row.mashup_selection_background ? ".widget-bootstrapcollection-container-" + rowUID + "-selected {background-color: " + row.mashup_selection_background + ";}" : "") +
              (row.mashup_hover_background ? ".widget-bootstrapcollection-container-" + rowUID + ":hover {background-color: " + row.mashup_hover_background + ";}" : "") +
              (row.mashup_active_background ? ".widget-bootstrapcollection-container-" + rowUID + ":active {background-color: " + row.mashup_active_background + ";}" : "") +
              (extraBorder || row.mashup_folded_height ? ".widget-bootstrapcollection-container-" + rowUID + " {transition: 0.3s;}" : "");

      $("<style>" + style + "</style>").appendTo(parent);

      if (row.mashup_accordion_group) {
        container.addClass("widget-bootstrapcollection-container-accordion-group-" + row.mashup_accordion_group);
        container.attr("mashup_folded_height", row.mashup_folded_height);
        container.attr("extra_border", extraBorder);
      }

      var rowSize = {"width": "100%", "height": "100%"};
      if (extraBorder) {
        rowSize.width = "calc(100% - " + extraBorder + "px)";
        rowSize.height = "calc(100% - " + extraBorder + "px)";
        rowSize.margin = (extraBorder / 2) + "px";
      }

      $("<div class='widget-bootstrapcollection-item widget-bootstrapcollection-item-" + rowUID + "'></div>").
              css(rowSize).
              appendTo(".widget-bootstrapcollection-container-" + rowUID).
              click(function () {
                if (row.mashup_folded_height && !row.mashup_folding_class) {
                  doFolding(row, container, extraBorder);
                }

                if (row.mashup_selection_group) {
                  $(".widget-bootstrapcollection-container-selection-group-" + row.mashup_selection_group).attr('class', function (index, className) {
                    return className.replace(/widget-bootstrapcollection-container-[0-9]*_[0-9]*-selected/, "");
                  });

                  container.addClass("widget-bootstrapcollection-container-" + rowUID + "-selected");

                  var selectedItems = thisWidget.getProperty("selectedItems");
                  selectedItems = TW.InfoTableUtilities.CloneInfoTable({
                    "dataShape": selectedItems.dataShape,
                    "rows": selectedItems.rows.
                            filter(function (selectedRow) {
                              return row.mashup_selection_group !== selectedRow.mashup_selection_group;
                            }).
                            concat([row])
                  });
                  thisWidget.setProperty("selectedItems", selectedItems);

                  selectedIndices = selectedIndices.filter(function (selectedIndex) {
                    return row.mashup_selection_group !== rows[selectedIndex].mashup_selection_group;
                  }).concat([rowIndex]);
                  thisWidget.updateSelection("data", selectedIndices);
                }

                if (row.mashup_clickable) {
                  var clickedItem = TW.InfoTableUtilities.CloneInfoTable({
                    "dataShape": dataShape,
                    "rows": [row]
                  });
                  thisWidget.setProperty("clickedItem", clickedItem);

                  var clickedDataItem = TW.InfoTableUtilities.CloneInfoTable({
                    "dataShape": row.mashup_data.dataShape,
                    "rows": row.mashup_data.rows
                  });
                  thisWidget.setProperty("clickedDataItem", clickedDataItem);

                  thisWidget.jqElement.triggerHandler('ItemWasClicked');
                }
              }).
              mashup({
                mashupName: row.mashup_name,
                mashupParameters: row.mashup_data.rows[0],
                loaded: function (success, mashupJqEl) {
                },
                loadFail: function (message) {
                },
                gotSize: function (width, height) {
                }
              });

      if (row.mashup_folded_height && row.mashup_folding_class) {
        $(".widget-bootstrapcollection-item-" + rowUID + " ." + row.mashup_folding_class).click(function () {
          doFolding(row, container, extraBorder);
        });
      }
    } else {
      if (row.height) {
        container.css({height: row.height + "px", "overflow-y": "auto"});
      }

      var childIndices = [];
      var children = rows.filter(function (child, index) {
        if (child.parent_uid === row.uid) {
          childIndices.push(index);
        }
        return child.parent_uid === row.uid;
      });
      for (var index = 0; index < children.length; index++) {
        addNode(children[index], childIndices[index], rows, ".widget-bootstrapcollection-container-" + rowUID, dataShape, debugMode);
      }

      container.scroll(function () {
        var scrollTop = container.scrollTop();
        if (debugMode) {
          console.log("BootstrapCollection - scroll - widget-bootstrapcollection-container-" + rowUID + " - scrollTop = " + scrollTop);
        }
        previousPosition["" + rowIndex] = scrollTop;
      });

      if (row.container_scroll_to_selected) {
        var selected = children.findIndex(function (child) {
          return child.mashup_selected;
        });
        if (selected !== -1) {
          var scrollTop = $(".widget-bootstrapcollection-container-" + rowUID).children("div").eq(selected).offset().top;
          container.scrollTop(scrollTop);
        }
      }

      if (row.container_scroll_to_previous_position && previousPosition["" + rowIndex]) {
        container.scrollTop(previousPosition["" + rowIndex]);
      }
    }
  }

  function doFolding(row, container, extraBorder) {
    var height = container.height() === row.height + extraBorder ? row.mashup_folded_height : row.height;

    $(".widget-bootstrapcollection-container-accordion-group-" + row.mashup_accordion_group).each(function (index, element) {
      var mashup_folded_height = parseInt($(element).attr("mashup_folded_height"));
      var extra_border = parseInt($(element).attr("extra_border"));
      if (mashup_folded_height) {
        $(element).css("height", (mashup_folded_height + extra_border) + "px");
      }
    });

    container.css("height", (height + extraBorder) + "px");
  }
};
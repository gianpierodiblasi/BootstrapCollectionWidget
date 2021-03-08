/* global TW */
TW.IDE.Widgets.bootstrapcollection = function () {
  var thisWidget = this;

  this.widgetIconUrl = function () {
    return '../Common/extensions/BootstrapCollectionWidget/ui/bootstrapcollection/bootstrap.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'BootstrapCollection',
      'description': 'Widget to show a Bootstrap style collection',
      'category': ['Common'],
      'iconImage': 'bootstrap.png',
      'supportsAutoResize': true,
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 400
        },
        'Height': {
          'description': 'height',
          'defaultValue': 300
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        },
        'headerMashup': {
          baseType: 'MASHUPNAME',
          'isEditable': true,
          isBindingTarget: true,
          defaultValue: '',
          description: "The mashup name of the (optional) header"
        },
        'headerHeight': {
          baseType: 'NUMBER',
          'defaultValue': 100,
          'isEditable': true,
          isBindingTarget: true,
          'description': "The mashup height of the (optional) header"
        },
        headerData: {
          baseType: 'INFOTABLE',
          isEditable: false,
          isBindingTarget: true,
          description: 'The mashup data source of the (optional) header'
        },
        'footerMashup': {
          baseType: 'MASHUPNAME',
          'isEditable': true,
          isBindingTarget: true,
          defaultValue: '',
          description: "The mashup name of the (optional) footer"
        },
        'footerHeight': {
          baseType: 'NUMBER',
          'defaultValue': 100,
          'isEditable': true,
          isBindingTarget: true,
          'description': "The mashup height of the (optional) footer"
        },
        footerData: {
          baseType: 'INFOTABLE',
          isEditable: false,
          isBindingTarget: true,
          description: 'The mashup data source of the (optional) footer'
        },
        data: {
          baseType: 'INFOTABLE',
          isEditable: false,
          isBindingTarget: true,
          description: 'The collection data source'
        },
        'scrollToSelected': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to scroll to the selected item after data loading'
        },
        'scrollToPreviousPosition': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to scroll to the previous position after data reloading'
        },
        selectedItems: {
          description: 'The selected items',
          isBindingSource: true,
          isEditable: false,
          baseType: 'INFOTABLE'
        },
        clickedItem: {
          description: 'The last clicked item',
          isBindingSource: true,
          isEditable: false,
          baseType: 'INFOTABLE'
        },
        clickedDataItem: {
          description: 'The infotable data of the last clicked item',
          isBindingSource: true,
          isEditable: false,
          baseType: 'INFOTABLE'
        }
      }
    };
  };

  this.widgetServices = function () {
    return {
    };
  };

  this.widgetEvents = function () {
    return {
      'ItemWasClicked': {}
    };
  };

  this.renderHtml = function () {
    var headerMashup = thisWidget.getProperty("headerMashup");
    var headerHeight = thisWidget.getProperty("headerHeight");
    var footerMashup = thisWidget.getProperty("footerMashup");
    var footerHeight = thisWidget.getProperty("footerHeight");

    var html =
            '<div class="widget-content widget-bootstrapcollection">' +
            '  ' + (headerMashup && headerHeight ? '<div class="bootstrapcollection-property" style="background:lightcyan;height:' + headerHeight + 'px">' + headerMashup + '</div>' : '') +
            '  <span class="bootstrapcollection-property">Bootstrap Collection</span>' +
            '  ' + (footerMashup && footerHeight ? '<div class="bootstrapcollection-property" style="background:lightcyan;position:absolute;left:0px;right:0px;bottom:0px;height:' + footerHeight + 'px">' + footerMashup + '</div>' : '') +
            '</div>';

    return html;

  };

  this.afterSetProperty = function (name, value) {
    switch (name) {
      case 'headerMashup':
      case 'headerHeight':
      case 'footerMashup':
      case 'footerHeight':
        return true;
      default:
        return false;
    }
  };
};
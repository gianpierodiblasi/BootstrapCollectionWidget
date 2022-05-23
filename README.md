# BootstrapCollectionWidget
An extension to show a Bootstrap style collection.

**This Extension is provided as-is and without warranty or support. It is not part of the PTC product suite and there is no PTC support.**

## Description
This extension provides a widget to show a Bootstrap style collection. The collection is described by the ds_BootstrapCollection DataShape (see below); the DataShape structure is mandatory, but it can be extended with additional fields.

## Properties
- debugMode - BOOLEAN (default = false): if set to true it sends to the browser's JS console a set of information useful for debugging the widget
- headerMashup - MASHUPNAME (no default value): the mashup name of the (optional) header
- headerHeight - NUMBER (default = 100): the mashup height of the (optional) header
- headerData - INFOTABLE (no default value): the mashup data source of the (optional) header
- footerMashup - MASHUPNAME (no default value): the mashup name of the (optional) footer
- footerHeight - NUMBER (default = 100): the mashup height of the (optional) footer
- footerData - INFOTABLE (no default value): the mashup data source of the (optional) footer
- data - INFOTABLE (no default value): the collection data source (use or duplicate & extend the Data Shape ds_BootstrapCollection, see below)
- scrollToSelected - BOOLEAN (default = false): true to scroll to the selected item after data loading
- scrollToPreviousPosition - BOOLEAN (default = false): true to scroll to the previous position after data reloading
- selectedItems - INFOTABLE (no default value): the selected items
- clickedItem - INFOTABLE (no default value): the last clicked item
- clickedDataItem - INFOTABLE (no default value): the infotable data of the last clicked item

## Events
- ItemWasClicked: event to notify that an item has been clicked

## DataShapes
- ds_BootstrapCollection
  - uid: an unique id to identify the item - STRING
  -  parent_uid: an optional parent uid - STRING
  -  bootstrap_class: the bootstrap class to assign to this cell - STRING
  -  height: the height of this cell - NUMBER
  -  is_mashup: true if this is a mashup, false otherwise (it is an empty cell) - BOOLEAN
  -  mashup_name: the mashup name - MASHUPNAME
  -  mashup_data: the mashup data - INFOTABLE
  -  mashup_selection_group: an optional string to manage selection group (only one mashup can be selected into the same selection group) - STRING
  -  mashup_selected: true if the mashup is selected - BOOLEAN
  -  mashup_clickable: true id the mashup is clickable - BOOLEAN
  -  mashup_selection_background: the background color for selection - STRING
  -  mashup_hover_background: the background color for hovering - STRING
  -  mashup_active_background: the background color for active mashup - STRING
  -  mashup_folded_height: the optional height of a folded mashup - STRING
  -  mashup_folding_class: the optional CSS class to detect the folding area - STRING
  -  mashup_accordion_group:  an optional string to manage accordion group (only one mashup can be open into the same accordion group) - STRING
  -  container_scroll_to_selected: true if the container should scroll to this cell when selected - BOOLEAN
  -  container_scroll_to_previous_position: true if the container should scroll to this cell when after data reloading - BOOLEAN

## Donate
If you would like to support the development of this and/or other extensions, consider making a [donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).

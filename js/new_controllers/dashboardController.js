'use strict';

/* Controllers */

app
  // Flot Chart controller 
  .controller('dashboardController', ['$scope', 'apiFactory', 'appConstants', '$localStorage', '$state', function($scope, apiFactory, appConstants, $localStorage, $state) {
  	
  	$scope.dt = moment();
  	$scope.dContent = {};
    $scope.dPayments = {};
    $scope.todays_picked_up = [];
    $scope.descrapency_boxes = [];
    $scope.in_warehouse_boxes = [];
    $scope.startOfMonth = moment().startOf('month').format(appConstants.showDateFormat);
    $scope.endOfMonth = moment().endOf('month').format(appConstants.showDateFormat);
    var tableW = '';
    var tableC = '';
    var tableD = '';

    // if(!$localStorage.user.length) {
    //   setTimeout(function () {
    //     $state.go('signin');
    //   }, 500);
    // }
    
    var initInWarehouseDataTable = function () {
      if (tableW && $.fn.dataTable.isDataTable( '#dashboard_in_warehouse_table' ) ) {
        tableW.destroy();
      }
      tableW = $('#dashboard_in_warehouse_table').DataTable({
        "fixedHeader": true,
        "scrollY": "350px",
        "paging": false,
      });
    }
    
    var initCreditDataTable = function () {
      if (tableC && $.fn.dataTable.isDataTable( '#dashboard_credit_table' ) ) {
        tableC.destroy();
      }
      tableC = $('#dashboard_credit_table').DataTable({
        "fixedHeader": true,
        "scrollY": "350px",
        "paging": false,
      });
    }
    
    var initBoxDescrapencyDataTable = function () {
      if (tableD && $.fn.dataTable.isDataTable( '#dashboard_descrapency_table' ) ) {
        tableD.destroy();
      }
      tableD = $('#dashboard_descrapency_table').DataTable({
        "fixedHeader": true,
        "scrollY": "350px",
        "paging": false,
      });
    }

  	apiFactory.dashboard.get().
	  	then(function(retData) {
	  		$scope.dContent = retData.data || [];
        angular.forEach($scope.dContent, function(v, i) {
          angular.forEach(v.invoices, function(v1, i1) {
            if(v1.is_box_descrapency == 'YES') {
              $scope.descrapency_boxes.push(v1);
            }
            if(!moment(v1.loaded_date, appConstants.dbDateFormat, true).isSame(moment().format(appConstants.dbDateFormat))) {
              $scope.todays_picked_up.push(v1);
            }
          });
        });
        initBoxDescrapencyDataTable();
	  	});

    // apiFactory.dashboard.get_in_warehouse().
    //   then(function(retData) {
    //     $scope.in_warehouse_boxes = retData.data || [];
    //   });

    apiFactory.dashboard.get_box_descrapencies().
      then(function(retData) {
        $scope.descrapency_boxes = retData.data || [];
      });

    /* apiFactory.payment.getPendingPayments({
      get_date: moment().format(appConstants.dbDateFormat),
      type: 'BEFORE_AND_FOR'
    }).
      then(function(retData) {
        $scope.dPayments = retData.data || [];
        initCreditDataTable();
      });
    */
    apiFactory.payment.getRecentSalesMonthWise().
      then(function(retData) {
        $scope.dGraphs = retData.data || [];
        drawGraph($scope.dGraphs);
      });

    apiFactory.bt.getSalesAgentsRankings({
      data: {
        startOfMonth: moment($scope.startOfMonth, appConstants.showDateFormat).format(appConstants.dbDateFormat),
        endOfMonth: moment($scope.endOfMonth, appConstants.showDateFormat).format(appConstants.dbDateFormat)
      }
    }).
      then(function(retData) {
        $scope.dSalesAgents = retData.data || [];
        angular.forEach($scope.dSalesAgents, function(v, i) {
          $scope.dSalesAgents[i]['total_cbm'] = v['total_cbm'] * 1;
          $scope.dSalesAgents[i]['total_qty'] = v['total_qty'] * 1;
        });
      });

    var drawGraph = function (argData) {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // am4core.NumberFormatter({
        //   intlLocales: 'en-IN'
      // });
      // Themes end

      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data
      chart.data = argData;
      // console.log(argData);

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // Create series
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "COTABATO";
      series.dataFields.dateX = "disp";
      series.strokeWidth = 3;
      series.name = "COTABATO";
      series.fill = "#7266BA";
      series.stroke = "#7266BA";
      series.minBulletDistance = 10;
      series.tooltipText = "[bold]COTABATO:[/] {COTABATO}";
      series.tooltip.pointerOrientation = "vertical";

      // Create series
      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "TAG";
      series2.dataFields.dateX = "disp";
      series2.strokeWidth = 3;
      series2.name = "TAG";
      series2.fill = "#F05050";
      series2.stroke = "#F05050";
      series2.minBulletDistance = 10;
      series2.tooltipText = "[bold]TAG:[/] {TAG}";
      series2.tooltip.pointerOrientation = "vertical";
      series2.strokeDasharray = "3,4";
      // series2.stroke = series.stroke;

      // Create series
      var series3 = chart.series.push(new am4charts.LineSeries());
      series3.dataFields.valueY = "CEBU";
      series3.dataFields.dateX = "disp";
      series3.strokeWidth = 3;
      series3.name = "CEBU";
      series3.fill = "#27C24C";
      series3.stroke = "#27C24C";
      series3.minBulletDistance = 10;
      series3.tooltipText = "[bold]CEBU:[/] {CEBU}";
      series3.tooltip.pointerOrientation = "vertical";
      // series3.strokeDasharray = "3,4";
      // series3.stroke = series.stroke;

      /* Add legend */
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.text = "[bold {color}]{name}[/]";

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;


    //   var chart = am4core.createFromConfig({
    //     // Reduce saturation of colors to make them appear as toned down
    //     "colors": {
    //       "saturation": 0.4
    //     },

    //     // Setting data
    //     "data": argData,

    //     // Add Y axis
    //     "yAxes": [{
    //       "type": "ValueAxis",
    //       "renderer": {
    //         "maxLabelPosition": 0.98
    //       }
    //     }],

    //     // Add X axis
    //     "xAxes": [{
    //       "type": "CategoryAxis",
    //       "renderer": {
    //         "minGridDistance": 20,
    //         "grid": {
    //           "location": 0
    //         }
    //       },
    //       "dataFields": {
    //         "category": "country"
    //       }
    //     }],

    //     // Add series
    //     "series": [{
    //       // Set type
    //       "type": "LineSeries",

    //       // Define data fields
    //       "dataFields": {
    //         "categoryX": "country",
    //         "valueY": "visits"
    //       },

    //       // Modify default state
    //       "defaultState": {
    //         "transitionDuration": 1000
    //       },

    //       // Set animation options
    //       "sequencedInterpolation": true,
    //       "sequencedInterpolationDelay": 100,

    //       // Modify color appearance
    //       "columns": {
    //         // Disable outline
    //         "strokeOpacity": 0,

    //         // Add adapter to apply different colors for each column
    //         "adapter": {
    //           "fill": function (fill, target) {
    //             return chart.colors.getIndex(target.dataItem.index);
    //           }
    //         }
    //       }
    //     }],

    //     // Enable chart cursor
    //     "cursor": {
    //       "type": "XYCursor",
    //       "behavior": "zoomX"
    //     }
    //   }, "chartdiv", "XYChart");
    }

  }]);
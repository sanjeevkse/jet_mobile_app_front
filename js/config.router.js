'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
          var layout = "views/app.html";
          $urlRouterProvider
              .otherwise('/signin');
          
          $stateProvider
              .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: layout,
                resolve: load(['toaster'])
              })
              .state('signin', {
                url: '/signin',
                templateUrl: 'views/page_signin.html',
                resolve: load(['js/new_controllers/signinController.js'])
              })
              .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                resolve: load(['js/new_controllers/dashboardController.js', 'js/controllers/chart.js'])
              })
              .state('app.user', {
                url: '/user',
                templateUrl: 'views/userManagement.html',
                resolve: load(['js/new_controllers/userManagementController.js'])
              })
              .state('app.user.userForm', {
                url: '/userForm/:personId?',
                templateUrl: 'views/userForm.html',
                resolve: load(['js/new_controllers/userFormController.js'])
              })
              .state('app.user.userList', {
                url: '/userList',
                templateUrl: 'views/userList.html',
                resolve: load(['js/new_controllers/userListController.js'])
              })
              .state('app.adminMgmt', {
                url: '/adminMgmt',
                templateUrl: 'views/adminManagement.html',
                resolve: load(['js/new_controllers/adminManagementController.js'])
              })
              // .state('app.supplierMgmt', {
              //   url: '/supplierMgmt',
              //   templateUrl: 'views/supplierManagement.html',
              //   resolve: load(['js/new_controllers/supplierManagementController.js'])
              // })
              .state('app.newBoxTracking', {
                url: '/newBoxTracking/:t/:id?',
                templateUrl: 'views/newBoxTracking.html',
                resolve: load(['js/new_controllers/newBoxTrackingController.js'])
              })
              .state('app.boxTracking', {
                url: '/boxTracking',
                templateUrl: 'views/boxTracking.html',
                resolve: load(['js/new_controllers/boxTrackingController.js'])
              })
              .state('app.paymentMgmt', {
                url: '/paymentMgmt',
                templateUrl: 'views/paymentMgmt.html',
                resolve: load(['js/new_controllers/paymentMgmtController.js'])
              })
              .state('app.receivable', {
                url: '/receivable',
                templateUrl: 'views/receivable.html',
                resolve: load(['js/new_controllers/receivableController.js'])
              })
              .state('app.updateDelete', {
                url: '/updateDelete',
                templateUrl: 'views/updateDelete.html',
                resolve: load(['js/new_controllers/updateDeleteController.js'])
              })
              .state('app.warehouseBoxes', {
                url: '/warehouseBoxes',
                templateUrl: 'views/warehouseBoxes.html',
                resolve: load(['js/new_controllers/warehouseBoxesController.js'])
              })
              .state('app.creditFacility', {
                url: '/creditFacility',
                templateUrl: 'views/creditFacility.html',
                resolve: load(['js/new_controllers/creditFacilityController.js'])
              })
              .state('app.shippingLineForwarder', {
                url: '/shippingLineForwarder/:t/:id?',
                templateUrl: 'views/shippingLineForwarder.html',
                resolve: load(['js/new_controllers/shippingLineForwarderController.js'])
              })
              .state('app.sLFList', {
                url: '/sLFList',
                templateUrl: 'views/sLFList.html',
                resolve: load(['js/new_controllers/sLFListController.js'])
              })
              .state('app.sLFPaymentMgmt', {
                url: '/sLFPaymentMgmt',
                templateUrl: 'views/sLFPaymentMgmt.html',
                resolve: load(['js/new_controllers/sLFPaymentMgmtController.js'])
              })
              .state('app.priceDetails', {
                url: '/priceDetails',
                templateUrl: 'views/priceDetails.html',
                resolve: load(['js/new_controllers/priceDetailsController.js'])
              })
              .state('app.reviewMgmt', {
                url: '/reviewMgmt',
                templateUrl: 'views/reviewMgmt.html',
                resolve: load(['js/new_controllers/reviewMgmtController.js'])
              })
              .state('app.updateBoxStatus', {
                url: '/updateBoxStatus',
                templateUrl: 'views/updateBoxStatus.html',
                resolve: load(['js/new_controllers/updateBoxStatusController.js'])
              })
              .state('app.updateBoxTracking', {
                url: '/updateBoxTracking',
                templateUrl: 'views/updateBoxTracking.html',
                resolve: load(['js/new_controllers/updateBoxTrackingController.js'])
              })
              .state('app.manifest2', {
                url: '/manifest2',
                templateUrl: 'views/manifest2.html',
                resolve: load(['js/new_controllers/manifest2Controller.js'])
              })
              .state('app.updateData1', {
                url: '/updateData1',
                templateUrl: 'views/updateData1.html',
                resolve: load(['js/new_controllers/updateData1Controller.js'])
              })
              .state('app.addContainerNumber', {
                url: '/addContainerNumber',
                templateUrl: 'views/addContainerNumber.html',
                resolve: load(['js/new_controllers/addContainerNumberController.js'])
              })
              .state('app.salesAgentTasks', {
                url: '/salesAgentTasks',
                templateUrl: 'views/salesAgentTasks.html',
                resolve: load(['js/new_controllers/salesAgentTasksController.js'])
              })
              .state('app.boxDetailsSearch', {
                url: '/boxDetailsSearch',
                templateUrl: 'views/boxDetailsSearch.html',
                resolve: load(['js/new_controllers/boxDetailsSearchController.js'])
              })
              .state('app.staffAttendance', {
                url: '/staffAttendance',
                templateUrl: 'views/staffAttendance.html',
                resolve: load(['js/new_controllers/staffAttendanceController.js'])
              })
              .state('app.staffAttendance.form', {
                url: '/staffAttendanceForm',
                templateUrl: 'views/staffAttendanceForm.html',
                resolve: load(['js/new_controllers/staffAttendanceFormController.js'])
              })
              .state('app.staffAttendance.monthlyReport', {
                url: '/staffAttendanceMonthlyReport',
                templateUrl: 'views/staffAttendanceMonthlyReport.html',
                resolve: load(['js/new_controllers/staffAttendanceMonthlyReportController.js'])
              })
              .state('app.staffPayroll', {
                url: '/staffPayroll',
                templateUrl: 'views/staffPayroll.html',
                resolve: load(['js/new_controllers/staffPayrollController.js'])
              });

          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );

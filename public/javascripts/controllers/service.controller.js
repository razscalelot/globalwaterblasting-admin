app.controller("serviceController", ($scope, $http, HelperService, $window) => {
    $scope.sImage = null;
    $scope.sBanner = null;
    $scope.sBefore = null;
    $scope.sAfter = null;
    $scope.service_image = "";
    $scope.service_banner = "";
    $scope.service_before = "";
    $scope.service_after = "";
    $scope.serviceImage = (input) => {
        $scope.sImage = null;
        if (input.files && input.files[0]) {
            var filename = input.files[0].name;
            var valid_extensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG)$/i;
            if (valid_extensions.test(filename)) {
                $(input.files).each(function () {
                    $scope.sImage = input.files[0];
                    $scope.serviceImageUploader();
                });
            } else {
                swal("", 'Invalid File Format, Valid Format is .jpg .png .jpeg !', "error");
            }
        }
    };
    $scope.serviceImageUploader = () => {
        if ($scope.sImage != null) {
            let formData = new FormData();
            formData.append("image", $scope.sImage);
            $http({
                url: BASE_URL + "create/image",
                method: "POST",
                data: formData,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false, },
            }).then(
                function (response) {
                    if (response.data.IsSuccess == true) {
                        if (response.data.Data) {
                            $scope.service_image = response.data.Data.url;
                        } else {
                            swal("", 'Some-thing went wrong while uploading the file! Please try again', "error");
                        }
                    }
                }, function (error) {
                    console.error(error);
                }
            );
        }
    };
    $scope.serviceBanner = (input) => {
        $scope.sBanner = null;
        if (input.files && input.files[0]) {
            var filename = input.files[0].name;
            var valid_extensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG)$/i;
            if (valid_extensions.test(filename)) {
                $(input.files).each(function () {
                    $scope.sBanner = input.files[0];
                    $scope.serviceBannerUploader();
                });
            } else {
                swal("", 'Invalid File Format, Valid Format is .jpg .png .jpeg !', "error");
            }
        }
    };
    $scope.serviceBannerUploader = () => {
        if ($scope.sBanner != null) {
            let formData = new FormData();
            formData.append("banner", $scope.sBanner);
            $http({
                url: BASE_URL + "create/banner",
                method: "POST",
                data: formData,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false, },
            }).then(
                function (response) {
                    if (response.data.IsSuccess == true) {
                        if (response.data.Data) {
                            $scope.service_banner = response.data.Data.url;
                        } else {
                            swal("", 'Some-thing went wrong while uploading the file! Please try again', "error");
                        }
                    }
                }, function (error) {
                    console.error(error);
                }
            );
        }
    };
    $scope.serviceBefore = (input) => {
        $scope.sBefore = null;
        if (input.files && input.files[0]) {
            var filename = input.files[0].name;
            var valid_extensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG)$/i;
            if (valid_extensions.test(filename)) {
                $(input.files).each(function () {
                    $scope.sBefore = input.files[0];
                    $scope.serviceBeforeUploader();
                });
            } else {
                swal("", 'Invalid File Format, Valid Format is .jpg .png .jpeg !', "error");
            }
        }
    };
    $scope.serviceBeforeUploader = () => {
        if ($scope.sBefore != null) {
            let formData = new FormData();
            formData.append("before", $scope.sBefore);
            $http({
                url: BASE_URL + "create/before",
                method: "POST",
                data: formData,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false, },
            }).then(
                function (response) {
                    if (response.data.IsSuccess == true) {
                        if (response.data.Data) {
                            $scope.service_before = response.data.Data.url;
                        } else {
                            swal("", 'Some-thing went wrong while uploading the file! Please try again', "error");
                        }
                    }
                }, function (error) {
                    console.error(error);
                }
            );
        }
    };
    $scope.serviceAfter = (input) => {
        $scope.sAfter = null;
        if (input.files && input.files[0]) {
            var filename = input.files[0].name;
            var valid_extensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG)$/i;
            if (valid_extensions.test(filename)) {
                $(input.files).each(function () {
                    $scope.sAfter = input.files[0];
                    $scope.serviceAfterUploader();
                });
            } else {
                swal("", 'Invalid File Format, Valid Format is .jpg .png .jpeg !', "error");
            }
        }
    };
    $scope.serviceAfterUploader = () => {
        if ($scope.sAfter != null) {
            let formData = new FormData();
            formData.append("after", $scope.sAfter);
            $http({
                url: BASE_URL + "create/after",
                method: "POST",
                data: formData,
                transformRequest: angular.identity,
                headers: { "Content-Type": undefined, "Process-Data": false, },
            }).then(
                function (response) {
                    if (response.data.IsSuccess == true) {
                        if (response.data.Data) {
                            $scope.service_after = response.data.Data.url;
                        } else {
                            swal("", 'Some-thing went wrong while uploading the file! Please try again', "error");
                        }
                    }
                }, function (error) {
                    console.error(error);
                }
            );
        }
    };
    $scope.createService = function () {
        $scope.response = {};
        console.log('$scope.points', $scope.points);
        $http({
            url: BASE_URL + 'create',
            method: "POST",
            cache: false,
            data: {
                servicename: $scope.servicename,
                image: $scope.service_image,
                banner: $scope.service_banner,
                shortdesc: $scope.shortdesc,
                longdesc: $scope.longdesc,
                before: $scope.service_before,
                after: $scope.service_after,
                title: $scope.title,
                longdesc1: $scope.longdesc1,
                points: $scope.points
            },
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.response = response.data.Message
                    document.getElementById('successModel').click();
                    window.location.href = "/service";
                } else {
                    document.getElementById('errorModel').innerHTML = response.data.Message;
                    document.getElementById('errorModel').click();
                }
            },
            function (error) {
                $scope.response = error.data.Message
                document.getElementById('errorModel').click();
            }
        );
    };

    $scope.points = [{ title: "", description: "" }];

    $scope.addInputField = function () {
        $scope.points.push({ title: "", description: "" });
    };

    $scope.removeInputField = function (index) {
        $scope.points.splice(index, 1);
    };

    $scope.services = {};
    $scope.getService = function () {
        let request = { page: $scope.page, limit: $scope.limit, search: $scope.search, isDelete: $scope.isDelete, teammember: $scope.teammember, tags: $scope.selectedTags };
        $http({
            url: BASE_URL + 'service/list',
            method: "POST",
            data: request,
            cache: false,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.services = response.data.Data;
                    $scope.pageNumberList = HelperService.paginator($scope.services.totalPages, $scope.page, 9);
                }
            },
            function (error) {
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
    $scope.getService();

    $scope.onSearch = () => {
        if ($scope.search.length > 2 || $scope.search.length == 0) {
            $scope.page = 1;
            $scope.getService();
        }
    }

    $scope.services = {};
    console.log("$routeParams", $window.location);
    $scope.getUpdateService = function () {
        
        let request = { id: id };
        $http({
            url: BASE_URL + 'edit:id',
            method: "POST",
            data: request,
            cache: false,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.services = response.data.Data;
                    $scope.pageNumberList = HelperService.paginator($scope.services.totalPages, $scope.page, 9);
                }
            },
            function (error) {
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
    $scope.getUpdateService();

});

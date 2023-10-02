app.controller("editServiceController", ($scope, $http, HelperService, $window) => {
    $scope.sImage = null;
    $scope.sBanner = null;
    $scope.sBefore = null;
    $scope.sAfter = null;
    $scope.service_image = "";
    $scope.service_banner = "";
    $scope.service_before = "";
    $scope.service_after = "";
    $scope.response = {};
    $scope.serviceImage = (input) => {
        $scope.sImage = null;
        if (input.files && input.files[0]) {
            var filename = input.files[0].name;
            var valid_extensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG)$/i;
            if (valid_extensions.test(filename)) {
                $(input.files).each(function () {
                    var reader = new FileReader();
                    reader.onload = function (input) {
                        $scope.PreviewImage = input.target.result;
                        $scope.$apply();
                    };
                    reader.readAsDataURL(input.files[0]);
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
                    console.log("response", response);
                    if (response.data.IsSuccess == true) {
                        if (response.data.Data) {
                            $scope.service_image = response.data.Data.url;
                        } else {
                            $scope.response = response.data.Message
                            document.getElementById('errorModel').click();
                        }
                    }
                }, function (error) {
                    $scope.response = error.data.Message
                    document.getElementById('errorModel').click();
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
                    var reader = new FileReader();
                    reader.onload = function (input) {
                        $scope.PreviewBanner = input.target.result;
                        $scope.$apply();
                    };
                    reader.readAsDataURL(input.files[0]);
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
                            $scope.response = response.data.Message
                            document.getElementById('errorModel').click();
                        }
                    }
                }, function (error) {
                    $scope.response = error.data.Message
                    document.getElementById('errorModel').click();
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
                    var reader = new FileReader();
                    reader.onload = function (input) {
                        $scope.PreviewBefore = input.target.result;
                        $scope.$apply();
                    };
                    reader.readAsDataURL(input.files[0]);
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
                            $scope.response = response.data.Message
                            document.getElementById('errorModel').click();
                        }
                    }
                }, function (error) {
                    $scope.response = error.data.Message
                    document.getElementById('errorModel').click();
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
                    var reader = new FileReader();
                    reader.onload = function (input) {
                        $scope.PreviewAfter = input.target.result;
                        $scope.$apply();
                    };
                    reader.readAsDataURL(input.files[0]);
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
                            $scope.response = response.data.Message
                            document.getElementById('errorModel').click();
                        }
                    }
                }, function (error) {
                    $scope.response = error.data.Message
                    document.getElementById('errorModel').click();
                }
            );
        }
    };

    $scope.editServices = {};
    var id = $window.location.search.split('?id=')[1];
    $scope.getUpdateService = function () {
        $http({
            url: BASE_URL + 'edit/service?id=' + id,
            method: "GET",
            cache: false,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.editServices = response.data.Data;
                    console.log($scope.editServices.images.before)
                    console.log($scope.editServices.images.after)
                } else {
                    document.getElementById('errorModel').innerHTML = response.data.Message;
                    document.getElementById('errorModel').click();
                }
            },
            function (error) {
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
    $scope.getUpdateService();


    $scope.editPoints = [{ title: "", description: "" }];

    $scope.addEditInputField = function () {
        $scope.editServices.servicedetails.points.push({ title: "", description: "" });
        console.log($scope.editServices);
    };

    $scope.removeEditInputField = function (index) {
        $scope.editServices.servicedetails.points.splice(index, 1);
    };

    $scope.updateService = function (editServices) {
        $http({
            url: BASE_URL + 'edit',
            method: "POST",
            cache: false,
            data: {
                serviceid: editServices._id,
                servicename: editServices.servicename,
                image: ($scope.service_image == '') ? editServices.image : $scope.service_image,
                banner: ($scope.service_banner == '') ? editServices.banner : $scope.service_banner,
                shortdesc: editServices.shortdesc,
                longdesc: editServices.longdesc,
                images: {
                    before: ($scope.service_before == '') ? editServices.images.before : $scope.service_before,
                    after: ($scope.service_after == '') ? editServices.images.after : $scope.service_after,
                },
                title: editServices.servicedetails.title,
                longdesc1: editServices.servicedetails.longdesc,
                points: editServices.servicedetails.points
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
                console.log("error", error);
                $scope.response = error.data.Message
                document.getElementById('errorModel').click();
            }
        );
    };

});

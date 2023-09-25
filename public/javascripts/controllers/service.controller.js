app.controller("serviceController", ($scope, $http,) => {
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
    // let len = $scope.ptitle.length;
    // let points = [];
    // for (var i = 0; i < len; i++) {
    //     let obj = {
    //         title: $scope.ptitle[i],
    //         decs: $scope.desc[i]
    //     };
    //     points.push(obj);
    // }
    $scope.createService = function () {
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
                ptitle: $scope.ptitle,
                desc: $scope.desc,
            },
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },

        }).then(
            function (response) {
                console.log("response", response);
            },
            function (error) {
                $('#loadingdiv').hide();
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
});

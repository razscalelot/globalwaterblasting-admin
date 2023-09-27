app.controller("quoteController", ($scope, $http, HelperService) => {
    $scope.quotes = {};
    $scope.getQuote = function () {
        let request = { page: $scope.page, limit: $scope.limit, search: $scope.search, isDelete: $scope.isDelete, teammember: $scope.teammember, tags: $scope.selectedTags };
        $http({
            url: BASE_URL + 'quote/list',
            method: "POST",
            data: request,
            cache: false,
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        }).then(
            function (response) {
                if (response.data.IsSuccess == true && response.data.Data != 0) {
                    $scope.quotes = response.data.Data;
                    $scope.pageNumberList = HelperService.paginator($scope.quotes.totalPages, $scope.page, 9);
                }
            },
            function (error) {
                console.log(error);
                console.error("Something Went Wrong! try again");
            }
        );
    };
    $scope.getQuote();

    $scope.onSearch = () => {
        if ($scope.search.length > 2 || $scope.search.length == 0) {
            $scope.page = 1;
            $scope.getQuote();
        }
    }
});

var app = angular.module('invoiceApp', []);

app.controller('InvoiceController', ['$scope', '$http', function($scope, $http) {
    $scope.invoice = {
        invoiceNumber: '',
        billFrom: '',
        billTo: '',
        contactNumber: '',
        gstNumber: '',
        customerName: '',
        invoiceDate: '',
        items: [
            { description: '', quantity: 1, unitPrice: 0, total: 0 }
        ]
    };

    $scope.updateTotal = function(item) {
        item.total = item.quantity * item.unitPrice;
        $scope.calculateInvoiceTotal();
    };

    $scope.calculateInvoiceTotal = function() {
        var total = 0;
        for (var i = 0; i < $scope.invoice.items.length; i++) {
            total += $scope.invoice.items[i].total;
        }
        $scope.invoiceTotal = total;
    };

    $scope.addItem = function() {
        $scope.invoice.items.push({ description: '', quantity: 1, unitPrice: 0, total: 0 });
    };

    $scope.removeItem = function(index) {
        $scope.invoice.items.splice(index, 1);
        $scope.calculateInvoiceTotal();
    };

    $scope.generatePDF = function() {
        $http.post('/api/invoice/generate', $scope.invoice, { responseType: 'arraybuffer' })
            .then(function(response) {
                var blob = new Blob([response.data], { type: 'application/pdf' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'invoice.pdf';
                link.click();
            }, function(error) {
                console.error('Error generating PDF', error);
            });
    };
}]);

var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function() {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
  $TABLE.find('table').append($clone);
});

$('.table-remove').click(function() {
  $(this).parents('tr').detach();
});



var counter = 0;
var valueMap // map of key: investors, value: historical average amount
var resultMap //final map of investors and amount
var requestedAmountMap //map of key: investors, value: requested Amount

//When Prorate Button is clicked
$("#Prorate-btn").click(function() {
  //resetting the map
  valueMap = new Map();
  resultMap = new Map();
  requestedAmountMap = new Map();


  var availableAllocation = document.getElementById("availableAllocation").value;
  var totalAvgHistory = 0;

  $('#inputAmount tr').each(function() {
    var name = $(this).find('input.nameInput').val();
    var reqAmt = $(this).find('input.requestedAmt').val();
    var avgAmt = $(this).find('input.averageAmt').val();

    if (avgAmt != 0 && typeof avgAmt !== "undefined") {
      totalAvgHistory = parseFloat(totalAvgHistory) + parseFloat(avgAmt);
      valueMap.set(name, avgAmt);
    }
    if (reqAmt != 0 && typeof reqAmt !== "undefined") {
      requestedAmountMap.set(name, reqAmt);
    }
    counter++;
  });

  //calculate the final amount for each investor 
  calculateProporation(valueMap, totalAvgHistory, availableAllocation, requestedAmountMap);
  appendResultsToHTML(resultMap);


}); // END click 

function calculateProporation(paramMap, totalAvg, allocation, reqAmtMap) {
  var remainingAllocation = parseFloat(allocation);
  var recalculatedAvg = parseFloat(totalAvg);

  for (let [key, value] of paramMap) {
    var calculation = 0;
    if (resultMap != null && resultMap.has(key)) {
      calculation = resultMap.get(key);
    }
    calculation += parseFloat(allocation) * (parseFloat(value) / totalAvg);

    if (reqAmtMap != null && reqAmtMap.has(key)) {

      //checking the resultMap to see if there is already a result for the investor - this means another calculation was done
      if (resultMap != null && resultMap.has(key)) {
        if (resultMap.get(key) < calculation && calculation <= reqAmtMap.get(key)) {
          resultMap.set(key, calculation);
          console.log("1 setting: key: " + key + " : " + calculation);
          remainingAllocation -= reqAmtMap.get(key);

          //recalculating the total historical average
          if (calculation == reqAmtMap.get(key)) {
            recalculatedAvg -= calculation;
          }
        }
      } else {
        //setting the values to the resultMap for the first time
        if (reqAmtMap.get(key) < calculation) {

          resultMap.set(key, reqAmtMap.get(key));
          remainingAllocation -= reqAmtMap.get(key);

          //recalculating the total historical average
          if (reqAmtMap.get(key) == reqAmtMap.get(key)) {
            recalculatedAvg -= valueMap.get(key);
          }

        } else {
          if (reqAmtMap.get(key) == calculation) {
            resultMap.set(key, calculation);
            remainingAllocation -= calculation;
            recalculatedAvg -= valueMap.get(key);
          } else {
            resultMap.set(key, calculation);
            remainingAllocation -= calculation;
          }
        }
      }
    }
  }

  //if remainingAllocation is greater than 0, then another round of calculations has to be done since there are funds left
  if (remainingAllocation > 0) {
    calculateProporation(paramMap, recalculatedAvg, remainingAllocation, reqAmtMap);
  }
}
//appending the final results from the resultMap to html 
function appendResultsToHTML(finalResultMap) {
  for (let [key, value] of finalResultMap) {
    $("#appendResults").append(key + ': ' + value + "<br/>");
  }
  $("#appendResults").append("<br/><br/>");
}


//export the final results
$BTN.click(function() {
  let exportToJson = {};

  resultMap.forEach(function(value, key) {
    exportToJson[key] = value;
  });
  // Output the result
  $EXPORT.text(JSON.stringify(exportToJson));

});
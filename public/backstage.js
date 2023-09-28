var drawNumbers = [];
var winners = [];
var drawNumbersProcessed = [];
var productOfSeeds = 0;
var ActiveDrawNumber = "";
var seedNumbers = ["0","0","0","0","0","0","0","0","0","0","0"];
var broadCastContent = {
    seedNumbers: ["0","0","0","0","0","0","0","0","0","0","0"],
    drawNumber: "",
    prizes: []
}

// Draw Event API Call
function DrawAPICall(drawNumberInput, seedNumbers) {
    var payload = {
        "request_data": {
            "inputs": {
                "DrawNumber": drawNumberInput,
                "Seed1": seedNumbers[0],
                "Seed10": seedNumbers[9],
                "Seed2": seedNumbers[1],
                "Seed3": seedNumbers[2],
                "Seed4": seedNumbers[3],
                "Seed5": seedNumbers[4],
                "Seed6": seedNumbers[5],
                "Seed7": seedNumbers[6],
                "Seed8": seedNumbers[7],
                "Seed9": seedNumbers[8]
            }
        },
        "request_meta": {
        }
    }


    // Replace 'https://api.example.com/data' with your actual API endpoint
    const apiUrl = 'https://excel.uat.us.coherent.global/coherent/api/v3/folders/Muamalat Prototype/services/3_draw_event/Execute';

    // Define headers
    const headers = new Headers({
       'Content-Type': 'application/json',
       'x-tenant-name': 'coherent',
       'SecretKey': '2277565c-9fad-4bf4-ad2b-1efe5748dd11'
    });

    // Define request options
    const requestOptions = {
        method: 'POST',  // Change the method to 'GET' if it's a GET request
        headers: headers,
        body: JSON.stringify(payload),
    };

    // Make the API call
    fetch(apiUrl, requestOptions)
        .then(response => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON data in the response
            return response.json();
        })
        .then(data => {
            // Log the data to the console
            winners = data["response_data"]["outputs"]["winners"]
            broadCastContent.prizes = winners
            changeBroadcastContent(broadCastContent)
            document.getElementById('winnersContainer').innerHTML = ""
            // Loop through the array to create rows
            for (var i = 0; i < winners.length; i++) {
                var row = document.createElement('div');
                row.classList.add('row');

                var rankCol = document.createElement('div');
                rankCol.classList.add('col');
                rankCol.textContent = winners[i].Rank;

                var winnerCol = document.createElement('div');
                winnerCol.classList.add('col');
                winnerCol.innerHTML = '<div onclick="emitWinner('+i+', '+winners[i].Winner+')">' + winners[i].Winner + '</div>';

                var prizeCol = document.createElement('div');
                prizeCol.classList.add('col');
                prizeCol.textContent = winners[i].Prize;

                row.appendChild(rankCol);
                row.appendChild(winnerCol);
                row.appendChild(prizeCol);

                document.getElementById('winnersContainer').appendChild(row);
            }
        })
        .catch(error => {
            // Log any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Draw Maintenance API Call
function DrawMaintenanceAPICall() {
    var payload = {
      "request_data": {
        "inputs": {
          "DrawNumber": "A002"
        }
      },
      "request_meta": {
      }
    }


    // Replace 'https://api.example.com/data' with your actual API endpoint
    const apiUrl = 'https://excel.uat.us.coherent.global/coherent/api/v3/folders/Muamalat Prototype/services/2_draw_maintenance/Execute';

    // Define headers
    const headers = new Headers({
       'Content-Type': 'application/json',
       'x-tenant-name': 'coherent',
       'SecretKey': '2277565c-9fad-4bf4-ad2b-1efe5748dd11'
    });

    // Define request options
    const requestOptions = {
        method: 'POST',  // Change the method to 'GET' if it's a GET request
        headers: headers,
        body: JSON.stringify({ key1: 'value1', key2: 'value2' }),
    };

    // Make the API call
    fetch(apiUrl, requestOptions)
        .then(response => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON data in the response
            return response.json();
        })
        .then(data => {
            // Log the data to the console
            drawNumbers = data["response_data"]["outputs"]["DrawNumbers"]
            drawNumbersProcessed = drawNumbers.map(item => item["Draw Number"]);
            

            // Get the dropdown menu element
            const dropdownMenu = document.getElementById('drawDropDown');

            // Populate the dropdown menu dynamically
            drawNumbersProcessed.forEach(drawNumber => {
                const dropdownItem = document.createElement('a');
                dropdownItem.classList.add('dropdown-item');
                dropdownItem.textContent = drawNumber;
                dropdownMenu.appendChild(dropdownItem);
                dropdownItem.onclick = () => selectDraw(drawNumber)
            });

            


        })
        .catch(error => {
            // Log any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
}

function selectDraw(drawNumber) {
    document.getElementById('drawDropDownButton').innerHTML = drawNumber
    ActiveDrawNumber = drawNumber
    document.getElementById('number-1').value = ""; broadCastContent.seedNumbers[0] = "0";
    document.getElementById('number-2').value = ""; broadCastContent.seedNumbers[1] = "0";
    document.getElementById('number-3').value = ""; broadCastContent.seedNumbers[2] = "0";
    document.getElementById('number-4').value = ""; broadCastContent.seedNumbers[3] = "0";
    document.getElementById('number-5').value = ""; broadCastContent.seedNumbers[4] = "0";
    document.getElementById('number-6').value = ""; broadCastContent.seedNumbers[5] = "0";
    document.getElementById('number-7').value = ""; broadCastContent.seedNumbers[6] = "0";
    document.getElementById('number-8').value = ""; broadCastContent.seedNumbers[7] = "0";
    document.getElementById('number-9').value = ""; broadCastContent.seedNumbers[8] = "0";
    document.getElementById('number-10').value = ""; broadCastContent.seedNumbers[9] = "0";
    DrawAPICall(drawNumber, seedNumbers)
    broadCastContent.drawNumber = drawNumber
    broadCastContent.prizes = []
    changeBroadcastContent(broadCastContent)
}   


function emitWinner(index, content) {
    console.log('emitted')
    var contentObject = {
        index: index,
        content: content
    }
    revealWinner(contentObject)
}  

function checkDrawButton(number) {
    numberminusone = number - 1
    numberminustwo = number - 2
    seedNumbers[numberminustwo] = document.getElementById('number-'+numberminusone).value;
    broadCastContent.seedNumbers = seedNumbers
    changeBroadcastContent(broadCastContent)

    var value1 = parseFloat(document.getElementById('number-1').value);
    var value2 = parseFloat(document.getElementById('number-2').value);
    var value3 = parseFloat(document.getElementById('number-3').value);
    var value4 = parseFloat(document.getElementById('number-4').value);
    var value5 = parseFloat(document.getElementById('number-5').value);
    var value6 = parseFloat(document.getElementById('number-6').value);
    var value7 = parseFloat(document.getElementById('number-7').value);
    var value8 = parseFloat(document.getElementById('number-8').value);
    var value9 = parseFloat(document.getElementById('number-9').value);
    var value10 = parseFloat(document.getElementById('number-10').value);

    // Check if values are valid (not NaN) before calculating the product
    if (!isNaN(value1) && !isNaN(value2) && !isNaN(value3) && !isNaN(value4) && !isNaN(value5) &&
        !isNaN(value6) && !isNaN(value7) && !isNaN(value8) && !isNaN(value9) && !isNaN(value10)) {

        productOfSeeds = value1 * value2 * value3 * value4 * value5 * value6 * value7 * value8 * value9 * value10;

        if (productOfSeeds>0) {
            var selectWinnersButton = document.getElementById('selectWinnersButton')
            selectWinnersButton.removeAttribute('disabled');
        }

    } else {
        if(number<11) {document.getElementById('number-'+number).focus();}
    }
}

function selectwinners(drawnum) {

    DrawAPICall(drawnum, seedNumbers)
}

DrawMaintenanceAPICall()
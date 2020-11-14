const apiKey = "SWOQ1FTkxNZUk5FtYfx7fV1il82AC2Yfi4ywhyqE";
const baseURL = "https://developer.nps.gov/api/v1/parks";
const states = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District Of Columbia",
  FM: "Federated States Of Micronesia",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MH: "Marshall Islands",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PW: "Palau",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function formatParams(params) {
  let newParams = params;
  const userStates = params.stateCode;
  delete newParams.stateCode;
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  const queryStates = userStates.map(
    (key) => `stateCode=${encodeURIComponent(key)}`
  );
  // console.log(queryStates);
  return queryItems.join("&") + "&" + queryStates.join("&");
}

function getResults(userState, maxResults) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: userState,
  };

  function displayResults(responseJson) {
    let resultsReceived = 0;
    if (parseInt(responseJson.total) <= parseInt(responseJson.limit)) {
      resultsReceived = responseJson.total;
    } else {
      resultsReceived = responseJson.limit;
    }

    if (parseInt(responseJson.total) === 0) {
      $("#results-list").empty();
      alert("No results were found!");
      return;
    }

    $("#results-list").empty();
    // $(responseJson.data[0].fullName);
    for (let i = 0; i < resultsReceived; i++) {
      $("#results-list").append(
        `<li><div class="card"><h2>${responseJson.data[i].fullName}</h2>
        <p>${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].fullName} Website</a><br>
        <img src="${responseJson.data[i].images[0].url}"></div><li>`
      );
    }
    console.log(responseJson);

    $("#results").removeClass("hidden");
  }

  const queryString = formatParams(params);
  const url = baseURL + "?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response["error"]["message"]);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      console.log(err);
    });
  console.log(url);
}

// console.log(params);

function formListener() {
  $("#search-form").submit((event) => {
    event.preventDefault();
    const userState = $("#state-input").val();
    const maxResults = $("#max-results").val();
    // console.log(userState, maxResults);
    getResults(userState, maxResults);
    $("#state-input").val("");
  });
}

// Generates the list of states after the page loads so it doesn't fill up my html doc
function generateStateList() {
  let keys = Object.keys(states);
  for (let i = 0; i < keys.length; i++) {
    $("#state-input").append(
      `<option value="${keys[i]}">${states[keys[i]]}</option>`
    );
  }
}

function handler() {
  formListener();
  generateStateList();
}

$(handler);

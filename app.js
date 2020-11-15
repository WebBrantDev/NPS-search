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

function formatParamsSingle(params) {
  console.log("Its in single");
  let newParams = params;
  const userStates = params.stateCode;
  delete newParams.stateCode;
  let queryStates = userStates;
  let urlArray = [];
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  queryStates = queryStates.map((key) => `stateCode=${key}`);
  for (let i = 0; i < userStates.length; i++) {
    // return queryItems.join("&") + "&" + queryStates[i];
    urlArray.push(queryItems.join("&") + "&" + queryStates[i]);
    console.log("queryStates: " + queryStates);
    console.log("array: " + urlArray);
    urlGenerator(urlArray[i]);
  }
}

function urlGenerator(queryString) {
  const url = baseURL + "?" + queryString;
  callForResults(url);
}

function formatParamsDouble(params) {
  console.log("Its in double");
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
  const doubleQuery = queryItems.join("&") + "&" + queryStates.join("&");
  urlGenerator(doubleQuery);
}

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

  if (checkBoxListener()) {
    $("#results-list").empty();
  }

  // $(responseJson.data[0].fullName);
  for (let i = 0; i < resultsReceived; i++) {
    $("#results").append();
    $("#results-list").append(
      `<li><div class="card">
      <h2><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].fullName}</a></h2>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].addresses[0].line1}
       ${responseJson.data[i].addresses[0].line2}
       ${responseJson.data[i].addresses[0].line3} <br>
        ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}<p>
      <img src="${responseJson.data[i].images[0].url}"></div><li>`
    );
  }
  console.log(responseJson);

  $("#results").removeClass("hidden");
}

function getResults(userState, maxResults) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: userState,
  };

  console.log("User State: " + userState);
  console.log("checkbox state: " + checkBoxListener());
  if (!checkBoxListener()) {
    formatParamsSingle(params);
  } else if (checkBoxListener() && userState.length > 1) {
    console.log("checkbox state inside: " + checkBoxListener());
    formatParamsDouble(params);
  } else if (checkBoxListener() && userState.length < 2) {
    alert("Please select multiple states.");
    return;
  }
  // callForResults(url);
}

function callForResults(url) {
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
    checkBoxListener();
    getResults(userState, maxResults);
    $("#state-input").val("");
    $("#results-list").empty();
  });
}

function checkBoxListener() {
  // console.log($("#checkDouble").prop("checked"));
  return $("#checkDouble").prop("checked");
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

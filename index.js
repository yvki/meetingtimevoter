var baseUrl = "https://meetingtimevoter.herokuapp.com"
var getUrlA = `${baseUrl}/basic/data`;
var getUrlU = `${baseUrl}/advance/data`;
var resultUrlA = `${baseUrl}/basic/result`;
var resultUrlU = `${baseUrl}/advance/result`;


const basicDataQuery = {
    meetingId1A: null,
    participantId1A: null,
    page1: 0,
    pageSize1: 5
}

const advanceDataQuery = {
    meetingId1U: null,
    participantId1U: null,
    page2: 0,
    pageSize2: 5
};

let isLastPage = false;

const basicDataPaginationFunction = {
    gotoFirstPage1: function () {
        basicDataQuery.page1 = 0;
    },
    changePage1: function (delta) {
        if (basicDataQuery.page1 + parseInt(delta) < 0) return alert("You are on the first page!");
        if (parseInt(delta) > 0 && isLastPage) return alert("You are on the last page!");
        basicDataQuery.page1 += parseInt(delta);
    },
    changePageSize1: function (newPageSize) {
        basicDataQuery['pageSize1'] = newPageSize;
    }
};

const advanceDataPaginationFunction = {
    gotoFirstPage2: function () {
        advanceDataQuery.page2 = 0;
    },
    changePage2: function (delta) {
        if (advanceDataQuery.page2 + parseInt(delta) < 0) return alert("You are on the first page!");
        if (parseInt(delta) > 0 && isLastPage) return alert("You are on the last page!");
        advanceDataQuery.page2 += parseInt(delta);
    },
    changePageSize2: function (newPageSize) {
        advanceDataQuery['pageSize2'] = newPageSize;
    }
};

function populateBasicDataTable(data) {
    console.log(data);
    isLastPage = data.length < basicDataQuery['pageSize1'];

    const postHtml = data.map(({ id, meetingid, participantid, availabilityid, starttime, endtime }) =>
        `
<tr>
<td>${id}</td>
<td>${meetingid}</td>
<td>${participantid}</td>
<td>${availabilityid}</td>
<td>${starttime}</td>
<td>${endtime}</td>
</tr>
`,
    );
    $("#mytbody1").html(postHtml);
};

function populateAdvanceDataTable(data) {
    console.log(data);
    isLastPage = data.length < advanceDataQuery['pageSize2'];

    const postHtml = data.map(({ id, meetingid, participantid, unavailabilityid, starttime, endtime }) =>
        `
<tr>
    <td>${id}</td>
    <td>${meetingid}</td>
    <td>${participantid}</td>
    <td>${unavailabilityid}</td>
    <td>${starttime}</td>
    <td>${endtime}</td>
</tr>
`,
    );
    $("#mytbody2").html(postHtml);
};

function getBasicDataFromBackend(callback) {
    $.get(getUrlA, basicDataQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
};

function getAdvanceDataFromBackend(callback) {
    $.get(getUrlU, advanceDataQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
};

function refreshBasicDataTable() {
    getBasicDataFromBackend(function (err, data) {
        if (err) return alert(err);
        populateBasicDataTable(data);
    });
};

function refreshAdvanceDataTable() {
    getAdvanceDataFromBackend(function (err, data) {
        if (err) return alert(err);
        populateAdvanceDataTable(data);
    });
};

function paginateBasicData(event) {
    const fn = $(this).attr("fn");
    const value = $(this).attr("value") || $(this).val();
    basicDataPaginationFunction[fn](value);
    refreshBasicDataTable();
};

function paginateAdvanceData(event) {
    const fn = $(this).attr("fn");
    const value = $(this).attr("value") || $(this).val();
    advanceDataPaginationFunction[fn](value);
    refreshAdvanceDataTable();
};

function registerBasicDataPaginationForm() {
    $('#basic-data-first-page').click(paginateBasicData);
    $('#basic-data-previous-page').click(paginateBasicData);
    $('#basic-data-next-page').click(paginateBasicData);
    $('#basic-data-page-size-select').change(paginateBasicData);
};

function registerAdvanceDataPaginationForm() {
    $('#advance-data-first-page').click(paginateAdvanceData);
    $('#advance-data-previous-page').click(paginateAdvanceData);
    $('#advance-data-next-page').click(paginateAdvanceData);
    $('#advance-data-page-size-select').change(paginateAdvanceData);
};

function filterBasicData(event) {
    $('#myfilterA input').not(':input[type=submit]')
        .not(':input[type=submit]')
        .each((idx, input) => {
            basicDataQuery[$(input).attr('key')] = $(input).val();
        });
    refreshBasicDataTable();
    return false;
};

function filterAdvanceData(event) {
    $('#myfilterU input').not(':input[type=submit]')
        .not(':input[type=submit]')
        .each((idx, input) => {
            advanceDataQuery[$(input).attr('key')] = $(input).val();
        });
    refreshAdvanceDataTable();
    return false;
};

function registerBasicDataFilterForm() {
    $('#myfilterA').submit(filterBasicData);
};

function registerAdvanceDataFilterForm() {
    $('#myfilterU').submit(filterAdvanceData);
};

$("form#compute1").submit(function () {
    var isValid = checkMeetA();
    return isValid;
});

var meetingIdAInvalid = $("input#meetingId2A~div.invalid-feedback");
var inputMeetingIdA = $("input#meetingId2A");
inputMeetingIdA.change(checkMeetA);

function checkMeetA() {
    var v = inputMeetingIdA.prop("value");
    if (v == "") {
        inputMeetingIdA.addClass('is-invalid');
        inputMeetingIdA.removeClass('is-valid');
        meetingIdAInvalid.html("Meeting Id must be filled up!");
        return false;
    } else {
        if (v.length != 10) {
            inputMeetingIdA.addClass('is-invalid');
            inputMeetingIdA.removeClass('is-valid');
            meetingIdAInvalid.html("Meeting Id can only be 10 digits!");
            return false;
        } else {
            inputMeetingIdA.removeClass('is-invalid');
            inputMeetingIdA.addClass('is-valid');
        }
        return true;
    }
};

$("form#compute2").submit(function () {
    var isValid = checkMeetU();
    var isValid = checkStart();
    var isValid = checkEnd();
    return isValid;
});

var meetingIdUInvalid = $("input#meetingId2U~div.invalid-feedback");
var inputMeetingIdU = $("input#meetingId2U");
inputMeetingIdU.change(checkMeetU);

var startTimeUInvalid = $("input#fromTime~div.invalid-feedback");
var inputStartTimeU = $("input#fromTime");
inputStartTimeU.change(checkStart);

var endTimeUInvalid = $("input#toTime~div.invalid-feedback");
var inputEndTimeU = $("input#toTime");
inputEndTimeU.change(checkEnd);

function checkMeetU() {
    var v = inputMeetingIdU.prop("value");
    if (v == "") {
        inputMeetingIdU.addClass('is-invalid');
        inputMeetingIdU.removeClass('is-valid');
        meetingIdUInvalid.html("Meeting Id must be filled up!");
        return false;
    } else if (v.length != 10) {
        inputMeetingIdU.addClass('is-invalid');
        inputMeetingIdU.removeClass('is-valid');
        meetingIdUInvalid.html("Meeting Id can only be 10 digits!");
        return false;
    } else {
        inputMeetingIdU.removeClass('is-invalid');
        inputMeetingIdU.addClass('is-valid');
    }
    return true;
};

function checkStart() {
    var v = inputStartTimeU.prop("value");
    if (v == "") {
        inputStartTimeU.addClass('is-invalid');
        inputStartTimeU.removeClass('is-valid');
        startTimeUInvalid.html("Start time must be filled up!");
        return false;
    } else {
        if (v.length != 4) {
            inputStartTimeU.addClass('is-invalid');
            inputStartTimeU.removeClass('is-valid');
            startTimeUInvalid.html("Meeting Id can only be 4 digits!");
            return false;
        } else {
            inputStartTimeU.removeClass('is-invalid');
            inputStartTimeU.addClass('is-valid');
        }
    }
    return true;
};

function checkEnd() {
    var v = inputEndTimeU.prop("value");
    if (v == "") {
        inputEndTimeU.addClass('is-invalid');
        inputEndTimeU.removeClass('is-valid');
        endTimeUInvalid.html("End time must be filled up!");
        return false;
    } else {
        if (v.length != 4) {
            inputEndTimeU.addClass('is-invalid');
            inputEndTimeU.removeClass('is-valid');
            endTimeUInvalid.html("Meeting Id can only be 4 digits!");
            return false;
        } else {
            inputEndTimeU.removeClass('is-invalid');
            inputEndTimeU.addClass('is-valid');
        }
    }
    return true;
};

$(document).ready(function () {
    registerBasicDataPaginationForm();
    registerAdvanceDataPaginationForm();
    registerBasicDataFilterForm();
    registerAdvanceDataFilterForm();
});
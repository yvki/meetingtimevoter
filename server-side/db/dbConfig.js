//--------------------------
//         Imports
//--------------------------
const { Client } = require('pg');
const CONNECTION_STRING = 'postgres://obdbwrpn:4sQRcoJ-DhrkmHG6nPGbGlSRljxVFaZQ@john.db.elephantsql.com:5432/obdbwrpn';

//--------------------------
//        Functions
//--------------------------
function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING,
    });
    client.connect();
    return client;
}

function resetTable(callback) {
    const client = connect();
    const query = `
  DROP TABLE IF EXISTS usera;
  DROP TABLE IF EXISTS useru;

  CREATE TABLE usera (
    id SERIAL PRIMARY KEY,
    meetingId BIGINT NOT NULL,
    participantId BIGINT NOT NULL,
    availabilityId BIGINT NOT NULL UNIQUE,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL
  );

  CREATE TABLE useru (
      id SERIAL PRIMARY KEY,
      meetingId BIGINT NOT NULL,
      participantId BIGINT NOT NULL,
      unavailabilityId BIGINT NOT NULL UNIQUE,
      startTime TIME NOT NULL,
      endTime TIME NOT NULL 
      );
  `;
    client.query(query, (err, res) => {
        client.end();
        console.log(err, res);
        callback(null, res);
    });
};

function createTable() {
    const client = connect();
    const query =
        `
    CREATE TABLE usera (
      id SERIAL PRIMARY KEY,
	  meetingId BIGINT NOT NULL,
	  participantId BIGINT NOT NULL,
	  availabilityId BIGINT NOT NULL UNIQUE,
	  startTime TIME NOT NULL,
	  endTime TIME NOT NULL
    );

    CREATE TABLE useru (
        id SERIAL PRIMARY KEY,
        meetingId BIGINT NOT NULL,
        participantId BIGINT NOT NULL,
        unavailabilityId BIGINT NOT NULL UNIQUE,
        startTime TIME NOT NULL,
        endTime TIME NOT NULL
        );
    `;
    client.query(query, (err, res) => {
        client.end();
        console.log(err, res);
    });
}

function addtoTable(data, callback) {
    //to accept empty array
    //if (data.length == 0) {
    //  callback(null);
    //  return;
    //};
    let i = 1;
    const placeholder = data.map((currentUser) => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',');

    if (data[0].availabilityId != null) {
        var params = data.reduce((result, currentUser) => [...result, currentUser.meetingId, currentUser.participantId, currentUser.availabilityId, currentUser.startTime, currentUser.endTime], []);
        var insertUserQuery = `INSERT INTO usera (meetingId, participantId, availabilityId, startTime, endTime) VALUES ${placeholder}`;
        console.log("availabilityId");
    } else {
        var params = data.reduce((result, currentUser) => [...result, currentUser.meetingId, currentUser.participantId, currentUser.unavailabilityId, currentUser.startTime, currentUser.endTime], []);
        var insertUserQuery = `INSERT INTO useru (meetingId, participantId, unavailabilityId, startTime, endTime) VALUES ${placeholder}`;
        console.log("unavailabilityId");
    };

    const client = connect();
    client.query(insertUserQuery, params, (error, results) => {
        client.end();
        if (error) {
            callback(error, null);
            return;
        };
        callback(null, results);
    });
};

function readTableA(pag, callback) {
    let whereStatement1;
    let whereStatement2;
    let limitOffsetClause;
    let query;
    console.log(pag);
    if (!pag.meetingId1A && !pag.participantId1A) {
        whereStatement1 == '';
    } else {
        if (!pag.meetingId1A) {
            whereStatement1 = `WHERE participantId = ${parseInt(pag.participantId1A)}`;
        } else {
            if (!pag.participantId1A) {
                whereStatement1 = `WHERE meetingid = ${parseInt(pag.meetingId1A)}`;
            } else {
                whereStatement1 = `WHERE meetingid = ${parseInt(pag.meetingId1A)} AND participantId = ${parseInt(pag.participantId1A)}`;
            }
        }
    };
    if (!pag.page1 && !pag.pageSize1) {
        limitOffsetClause == '';
    } else {
        limitOffsetClause = `LIMIT ${pag.pageSize1} OFFSET ${(parseInt(pag.page1) * parseInt(pag.pageSize1))}`;
    };

    if (!whereStatement1 && !whereStatement2) {
        query = `SELECT * FROM usera ${limitOffsetClause}`;
    } else {
        if (!whereStatement2) {
            query = `SELECT * FROM usera ${whereStatement1} ${limitOffsetClause}`;
        } else {
            query = `SELECT * FROM usera ${whereStatement2}`;
        };
    };

    console.log(query);
    const client = connect();
    client.query(query, (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        else {
            callback(null, result.rows);
            client.end();
        }
    });
};

function readTableU(pag, callback) {
    let whereStatement1;
    let whereStatement2;
    let limitOffsetClause;
    let query;
    console.log(pag);
    if (!pag.meetingId1U && !pag.participantId1U) {
        whereStatement1 == '';
    } else {
        if (!pag.meetingId1U) {
            whereStatement1 = `WHERE participantId = ${parseInt(pag.participantId1U)}`;
        } else {
            if (!pag.participantId1U) {
                whereStatement1 = `WHERE meetingid = ${parseInt(pag.meetingId1U)}`;
            } else {
                whereStatement1 = `WHERE meetingid = ${parseInt(pag.meetingId1U)} AND participantId = ${parseInt(pag.participantId1U)}`;
            }
        }
    };
    if (!pag.page2 && !pag.pageSize2) {
        limitOffsetClause == '';
    } else {
        limitOffsetClause = `LIMIT ${pag.pageSize2} OFFSET ${(parseInt(pag.page2) * parseInt(pag.pageSize2))}`;
    };

    if (!whereStatement1 && !whereStatement2) {
        query = `SELECT * FROM useru ${limitOffsetClause}`;
    } else {
        if (!whereStatement2) {
            query = `SELECT * FROM useru ${whereStatement1} ${limitOffsetClause}`;
        } else {
            query = `SELECT * FROM useru ${whereStatement2}`;
        };
    };

    console.log(query);
    const client = connect();
    client.query(query, (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        else {
            callback(null, result.rows);
            client.end();
        }
    });
};

function resultA(meetingId, callback) {
    const query = `SELECT * FROM usera WHERE meetingId = ${meetingId};`
    console.log(query);
    const client = connect();
    client.query(query, (err, results) => {
        client.end();
        if (err) {
            callback(err);
            return;
        };

        const rowsObj = results.rows
        console.log(rowsObj);

        //combine the availability data
        // sort by participantids then starttime then endtime
        rowsObj.sort(function (a1, a2) {
            if (a1.participantid === a2.participantid) {
                return a1.starttime.localeCompare(a2.starttime);
            };
            return a1.participantid - a2.participantid;
        });
        // console.log(rowsObj);

        const availabilityData = [];
        // go through each data
        for (let i = 0; i < rowsObj.length; i++) {
            const currentData = rowsObj[i];
            if (availabilityData.length === 0) {
                availabilityData.push(currentData);
                continue;
            };
            const lastAvailability = availabilityData[availabilityData.length - 1];
            const shouldMerge = lastAvailability.participantid === currentData.participantid && lastAvailability.endtime > currentData.starttime;
            // check if current data is to be merged with last availability in the array
            if (shouldMerge) {
                // if yes, merge it
                if (lastAvailability.endtime > currentData.endtime) {
                    lastAvailability.endtime = lastAvailability.endtime
                } else {
                    lastAvailability.endtime = currentData.endtime
                };
            } else {
                // if no, add it into the array
                availabilityData.push(currentData);
            };
        };
        console.log(availabilityData);

        const events = [];

        // go through each of the data:
        for (let i = 0; i < availabilityData.length; i++) {
            // console.log(availabilityData.length)
            const combinedData = availabilityData[i];

            // extract each start and time event 
            // 0 = start, 1 = end
            const start = { event: 0, time: combinedData.starttime };
            const end = { event: 1, time: combinedData.endtime };

            // push into the events array
            events.push(start);
            events.push(end);
        };

        // sort the events:
        events.sort(function (e1, e2) {
            // how it works
            /*
            negative: e1 before e2
            positive: e2 before e1
            zero: no change in current position
            */
            // console.log(e1, e2);
            // console.log(e1.time.localeCompare(e2.time))
            return e1.time.localeCompare(e2.time);
        });
        console.log(events);

        var count = 0;
        var bestStart = 0;
        var bestEnd = 0;
        var bestCount = 0;

        // iterate through each pair event i and i+1
        for (let i = 0; i + 1 < events.length; i++) {
            // console.log(events.length)
            const event1 = events[i];
            const event2 = events[i + 1];
            if (event1.event === 0) {
                // if event is a 'start' event, increment count by 1
                count += 1;
            } else {
                // if event is an 'end' event, decrement count by 1
                count -= 1;
            };
            if (count > bestCount) {
                bestCount = count;
                bestStart = event1.time;
                bestEnd = event2.time;
            };
        };
        console.log(`From ${bestStart} to ${bestEnd} number of participants is ${bestCount}`);

        const participants = [];

        for (let i = 0; i < availabilityData.length; i++) {
            const currentData = availabilityData[i];
            const wrapBestTime = currentData.starttime <= bestStart && currentData.endtime >= bestEnd;
            // check if availability data 'wraps' the bestStart and bestEnd
            if (wrapBestTime) {
                // if yes, add participant
                participants.push(currentData.participantid);
            };
            // if no, ignore availability data
        };

        if (bestStart === 0 && bestEnd === 0) {
            bestStart = '0000';
            bestEnd = '0000';
        } else {
            bestStart = bestStart.split(':').join('');
            bestEnd = bestEnd.split(':').join('');
            bestStart = bestStart.substring(0, bestStart.length - 2);
            bestEnd = bestEnd.substring(0, bestEnd.length - 2);
        };

        participants.forEach((participant, i) => {
            participants[i] = { "participantId": parseInt(participant) };
        });
        console.log(participants);

        var result = {
            "fromTime": bestStart,
            "toTime": bestEnd,
            "participants": participants,
        };

        callback(err, result);
    });
};

function resultU(input, callback) {
    const query = `SELECT * FROM useru WHERE meetingId = ${input.meetingId}`
    console.log(query);
    const client = connect();
    client.query(query, (err, results) => {
        client.end();

        if (err) {
            callback(err);
            return;
        };
        if (input.fromTime === null || input.toTime === null) {
            callback(err);
            return;
        };
        const rowsObj = results.rows
        // console.log(rowsObj);

        // combine the availability data
        // sort by participantids then starttime then endtime
        rowsObj.sort(function (a1, a2) {
            if (a1.participantid === a2.participantid) {
                return a1.starttime.localeCompare(a2.starttime);
            };
            return a1.participantid - a2.participantid;
        });
        console.log(rowsObj);

        // convert input time to time strings for better computation
        input.fromTime += '00';
        input.toTime += '00';

        // split them into hour, minute, and second
        // slice them by indexes and fit them into hr, min, and sec accordingly
        var fromTimeHr = input.fromTime.slice(0, 2);
        var fromTimeMin = input.fromTime.slice(2, 4);
        var fromTimeS = input.fromTime.slice(4, 6);
        var toTimeHr = input.toTime.slice(0, 2);
        var toTimeMin = input.toTime.slice(2, 4);
        var toTimeS = input.toTime.slice(4, 6);

        // add them with ':'
        input.fromTime = fromTimeHr + ':' + fromTimeMin + ':' + fromTimeS;
        input.toTime = toTimeHr + ':' + toTimeMin + ':' + toTimeS;

        const unavailabilityData = [];

        for (let i = 0; i < rowsObj.length; i++) {
            const currentData = rowsObj[i];
            if (currentData.starttime < input.fromTime && currentData.endtime > input.toTime) {
                continue;
            }
            else if (currentData.starttime > input.fromTime && currentData.endtime < input.toTime) {
                unavailabilityData.push({
                    participantId: currentData.participantid,
                    startTime: input.fromTime,
                    endTime: currentData.starttime
                });
                unavailabilityData.push({
                    participantId: currentData.participantid,
                    startTime: currentData.endtime,
                    endTime: input.toTime
                });
            }
            else if (currentData.starttime <= input.fromTime) {
                var time;
                if (input.fromTime >= currentData.endtime) {
                    time = input.fromTime;
                } else {
                    time = currentData.endtime;
                };
                unavailabilityData.push({
                    participantId: currentData.participantid,
                    startTime: time,
                    endTime: input.toTime
                });
            }
            else if (currentData.endtime >= input.toTime) {
                var time;
                if (input.toTime <= currentData.starttime) {
                    time = input.toTime;
                } else {
                    time = currentData.starttime;
                };
                unavailabilityData.push({
                    participantId: currentData.participantid,
                    startTime: input.fromTime,
                    endTime: time
                });
            };
        };
        console.log(unavailabilityData);

        const availabilityData = [];
        // go through each data
        for (let i = 0; i < unavailabilityData.length; i++) {
            const currentData = unavailabilityData[i]
            if (availabilityData.length === 0) {
                availabilityData.push(currentData);
                continue;
            };
            const lastAvailability = availabilityData[availabilityData.length - 1];
            const shouldMerge = lastAvailability.participantId === currentData.participantId && lastAvailability.endTime >= currentData.startTime;
            // check if current data is to be merged with last availability in the array
            if (shouldMerge) {
                // if yes, merge it
                if (lastAvailability.endTime <= currentData.endTime) {
                    lastAvailability.endTime = lastAvailability.endTime
                } else {
                    lastAvailability.endTime = currentData.endTime
                };
            } else {
                // if no, add it into the array
                availabilityData.push(currentData);
            };
        };
        console.log(availabilityData);

        const events = [];

        // go through each of the data:
        for (let i = 0; i < availabilityData.length; i++) {
            const combinedData = availabilityData[i];
            console.log(combinedData)

            // extract each start and time event 
            // 0 = start, 1 = end
            const start = { event: 0, time: combinedData.startTime };
            const end = { event: 1, time: combinedData.endTime };

            // push into the events array
            events.push(start);
            events.push(end);
        };
        // console.log(events);

        // sort the events:
        events.sort(function (e1, e2) {
            // how it works
            /*
            negative: e1 before e2
            positive: e2 before e1
            zero: no change in current position
            */
            // console.log(e1.time.localeCompare(e2.time))
            return e1.time.localeCompare(e2.time);
        });
        console.log(events);


        var count = 0;
        var bestStart = 0;
        var bestEnd = 0;
        var bestCount = 0;

        // iterate through each pair event i and i+1
        for (let i = 0; i + 1 < events.length; i++) {
            // console.log(events.length)
            const event1 = events[i];
            const event2 = events[i + 1];
            if (event1.event === 0) {
                // if event is a 'start' event, increment count by 1
                count ++;
            } else {
                // if event is an 'end' event, decrement count by 1
                count --;
            };
            console.log(count);

            if (count > bestCount) {
                // do normal setting stuff here
                if (event2.time !== event1.time) {

                    bestCount = count;
                    // console.log(event1);
                    bestStart = event1.time;
                    // console.log(event2);
                    bestEnd = event2.time;
                    // console.log(bestEnd)
                };
            };
        };
        console.log(`From ${bestStart} to ${bestEnd} number of participants is ${bestCount}`);

        const participants = [];

        // go through all data
        for (let i = 0; i < availabilityData.length; i++) {
            const currentData = availabilityData[i];
            const wrapBestTime = currentData.startTime <= bestStart && currentData.endTime >= bestEnd;
            // check if availability data 'wraps' the bestStart and bestEnd
            if (wrapBestTime) {
                // if yes, add participant
                participants.push(currentData.participantId);
            };
            // if no, ignore availability data
        };

        // Format the time strings to fit the format
        if (bestStart === 0 && bestEnd === 0) {
            // no meeting timings just directly turn to '0000'
            bestStart = '0000';
            bestEnd = '0000';
        } else {
            // turn to 4 digits number in a string
            bestStart = bestStart.split(':').join('');
            bestEnd = bestEnd.split(':').join('');
            bestStart = bestStart.substring(0, bestStart.length - 2);
            bestEnd = bestEnd.substring(0, bestEnd.length - 2);
        };

        // convert participant availability to correct format
        // format string to numbers to fit the format
        participants.forEach((participant, i) => {
            participants[i] = { "participantId": parseInt(participant) };
        });
        console.log(participants);

        var result = {
            "fromTime": bestStart,
            "toTime": bestEnd,
            "participants": participants,
        };

        callback(err, result);
    });
};

module.exports = {
    resetTable,
    createTable,
    addtoTable,
    readTableA,
    readTableU,
    resultA,
    resultU
};

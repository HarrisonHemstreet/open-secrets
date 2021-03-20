// const csvjson = require('csvjson');
// const readFile = require('fs').readFile;
// const writeFile = require('fs').writeFile;
//0. Figure out how to get CID's of different legislators
//      NESTED ARRAY ORDERING
//      i. USA
//          ** loop through all states within the array USA
//      ii. states
//          ** loop through all legislators within each state
//      iii. legislators
//          ** Save each CID number within each legislator into a new array
//      iv. CID number

//1. loop over states within each query
//2. make the key be the legislator's name, the value the CID - JUST ONE BIG OBJECT

let states = [
    "al",
    "ak",
    "az",
    "ar",
    "ca",
    "co",
    "ct",
    "de",
    "fl",
    "ga",
    "hi",
    "id",
    "il",
    "in",
    "ia",
    "ks",
    "ky",
    "la",
    "me",
    "md",
    "ma",
    "mi",
    "mn",
    "ms",
    "mo",
    "mt",
    "ne",
    "nv",
    "nh",
    "nj",
    "nm",
    "ny",
    "nc",
    "nd",
    "oh",
    "ok",
    "or",
    "pa",
    "ri",
    "sc",
    "sd",
    "tn",
    "tx",
    "ut",
    "vt",
    "va",
    "wa",
    "wv",
    "wi",
    "wy"
];



async function getLegislators_() {
    // console.log(states);
    currState = [states[0]];
    for(let i = 0; i < states.length; i++){
        currState = states[i];
    }
    const res = await fetch(`http://www.opensecrets.org/api/?method=getLegislators&id=tx&apikey=ab3cee75d329046cc5e263712b39b577&output=json`)
    // console.log(res);

    const legislators = await res.json();
    console.log(legislators.response.legislator.length);
    // console.log(legislators.response.legislator[0]);

    // //the way you retireve legislator's cid's
    //  //legislators.response.legislator[NEED THIS TO BE A LOOP]["@attributes"].firstlast
    // //legislators.response.legislator[NEED THIS TO BE A LOOP]["@attributes"].cid

    // console.log(legislators.response.legislator[1]["@attributes"].firstlast);
    // console.log(legislators.response.legislator[1]["@attributes"].cid);

    return 'hi';
}

async function loopStates() {
    // loop through every state
    for(let i = 0; i < 50; i++){
            // make a request to each state taking the index of each state
            const res = await fetch(`http://www.opensecrets.org/api/?method=getLegislators&id=${states[i]}&apikey=ab3cee75d329046cc5e263712b39b577&output=json`)
            // save each state's info to a variable legislators
            const legislators = await res.json();
            // loop through each legislator of each state logging out the state and each state legislator
            for(let j = 0; j < legislators.response.legislator.length; j++){
                console.log(states[i], legislators.response.legislator[i])
            }
            // console.log(i, res);
            // console.log(states[i]);
    }
}


//Make an API call to the Open-Secrets API for info on:
//1.  candContrib: results of top contributors to specified candidate for a House or Senate seat or member of Congress. 
//                 These are 6-year numbers for senators/Senate candidates; 2-year numbers for representatives/House candidates.

//2. candIndByInd: Provides total contributed to specified candidate from specified industry. Senate data reflects 2-year totals.

//3. candIndustry: candIndustry	Provides the top ten industries contributing to a specified candidate for a House or Senate seat           
//                 or member of Congress. These are 6-year numbers for Senators/Senate candidates; 2-year total for 
//                 Representatives/House candidates.

//4. candSector: Returns data on a candidate's Sector contributions to specified candidate for a House or Senate seat or member 
//               of Congress. These are 6 year numbers for Senators/Senate candidates; 2 years for Representatives/House candidates

//5. candSummary: 	Method to access summary data for a candidate


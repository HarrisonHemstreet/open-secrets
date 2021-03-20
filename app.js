//Make an API call to the Open-Secrets API for info on:
//1.  candContrib: results of top contributors to specified candidate for a House or Senate seat or member of Congress. 
//                 These are 6-year numbers for senators/Senate candidates; 2-year numbers for representatives/House candidates.

//works for NJ
fetch('http://www.opensecrets.org/api/?method=getLegislators&id=CA&apikey=ab3cee75d329046cc5e263712b39b577&output=json')
    .then(res => res.json())
    .then(console.log);



//2. candIndByInd: Provides total contributed to specified candidate from specified industry. Senate data reflects 2-year totals.

//3. candIndustry: candIndustry	Provides the top ten industries contributing to a specified candidate for a House or Senate seat           
//                 or member of Congress. These are 6-year numbers for Senators/Senate candidates; 2-year total for 
//                 Representatives/House candidates.

//4. candSector: Returns data on a candidate's Sector contributions to specified candidate for a House or Senate seat or member 
//               of Congress. These are 6 year numbers for Senators/Senate candidates; 2 years for Representatives/House candidates

//5. candSummary: 	Method to access summary data for a candidate
import React, { useState } from "react";
import api from "./api";
import { Link } from 'react-router-dom';


const StateRep = () => {
  const [search, setSearch] = useState(false);
  const [stateCode, setStateCode] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const phoneBook = {
    "Adams, Alma": "(202) 225-1510",
    "Aderholt, Robert": "(202) 225-4876",
    "Aguilar, Pete": "(202) 225-3201",
    "Alford, Mark": "(202) 225-2876",
    "Allen, Rick": "(202) 225-2823",
    "Amo, Gabe": "(202) 225-4911",
    "Amodei, Mark": "(202) 225-6155",
    "Ansari, Yassamin": "(202) 225-4065",
    "Arrington, Jodey": "(202) 225-4005",
    "Auchincloss, Jake": "(202) 225-5931",
    "Babin, Brian": "(202) 225-1555",
    "Bacon, Don": "(202) 225-4155",
    "Baird, James": "(202) 225-5037",
    "Balderson, Troy": "(202) 225-5355",
    "Balint, Becca": "(202) 225-4115",
    "Barr, Andy": "(202) 225-4706",
    "Barragan, Nanette": "(202) 225-8220",
    "Barrett, Tom": "(202) 225-4872",
    "Baumgartner, Michael": "(202) 225-2006",
    "Bean, Aaron": "(202) 225-5435",
    "Burlison, Eric": "(202) 225-6536",
    "Bynum, Janelle": "(202) 225-5711",
    "Calvert, Ken": "(202) 225-1986",
    "Cammack, Kat": "(202) 225-5744",
    "Carbajal, Salud": "(202) 225-3601",
    "Carey, Mike": "(202) 225-2015",
    "Carson, Andre": "(202) 225-4011",
    "Carter, Earl": "(202) 225-5831",
    "Carter, John": "(202) 225-3864",
    "Carter, Troy": "(202) 225-6636",
    "Casar, Greg": "(202) 225-5645",
    "Case, Ed": "(202) 225-2726",
    "Casten, Sean": "(202) 225-4561",
    "Castor, Kathy": "(202) 225-3376",
    "Castro, Joaquin": "(202) 225-3236",
    "Cherfilus-McCormick, Sheila": "(202) 225-1313",
    "Chu, Judy": "(202) 225-5464",
    "Ciscomani, Juan": "(202) 225-2542",
    "Cisneros, Gilbert": "(202) 225-5256",
    "Clark, Katherine": "(202) 225-2836",
    "Clarke, Yvette": "(202) 225-6231",
    "Cleaver, Emanuel": "(202) 225-4535",
    "Cline, Ben": "(202) 225-5431",
    "Cloud, Michael": "(202) 225-7742",
    "Clyburn, James": "(202) 225-3315",
    "Clyde, Andrew": "(202) 225-9893",
    "Cohen, Steve": "(202) 225-3265",
    "Cole, Tom": "(202) 225-6165",
    "Collins, Mike": "(202) 225-4101",
    "Comer, James": "(202) 225-3115",
    "Conaway, Herbert": "(202) 225-4765",
    "Connolly, Gerald": "(202) 225-1492",
    "Correa, J.": "(202) 225-2965",
    "Costa, Jim": "(202) 225-3341",
    "Courtney, Joe": "(202) 225-2076",
    "Craig, Angie": "(202) 225-2271",
    "Crane, Elijah": "(202) 225-3361",
    "Crank, Jeff": "(202) 225-4422",
    "Crawford, Eric": "(202) 225-4076",
    "Crenshaw, Dan": "(202) 225-6565",
    "Crockett, Jasmine": "(202) 225-8885",
    "Crow, Jason": "(202) 225-7882",
    "Cuellar, Henry": "(202) 225-1640",
    "Davids, Sharice": "(202) 225-2865",
    "Davidson, Warren": "(202) 225-6205",
    "Davis, Danny": "(202) 225-5006",
    "Davis, Donald": "(202) 225-3101",
    "De La Cruz, Monica": "(202) 225-9901",
    "DeGette, Diana": "(202) 225-4431",
    "DeLauro, Rosa": "(202) 225-3661",
    "DeSaulnier, Mark": "(202) 225-2095",
    "Dean, Madeleine": "(202) 225-4731",
    "DelBene, Suzan": "(202) 225-6311",
    "Deluzio, Christopher": "(202) 225-2301",
    "DesJarlais, Scott": "(202) 225-6831",
    "Dexter, Maxine": "(202) 225-4811",
    "Diaz-Balart, Mario": "(202) 225-4211",
    "Dingell, Debbie": "(202) 225-4071",
    "Doggett, Lloyd": "(202) 225-4865",
    "Donalds, Byron": "(202) 225-2536",
    "Downing, Troy": "(202) 225-3211",
    "Dunn, Neal": "(202) 225-5235",
    "Edwards, Chuck": "(202) 225-6401",
    "Elfreth, Sarah": "(202) 225-4016",
    "Ellzey, Jake": "(202) 225-2002",
    "Emmer, Tom": "(202) 225-2331",
    "Escobar, Veronica": "(202) 225-4831",
    "Espaillat, Adriano": "(202) 225-4365",
    "Estes, Ron": "(202) 225-6216",
    "Evans, Dwight": "(202) 225-4001",
    "Evans, Gabe": "(202) 225-5625",
    "Ezell, Mike": "(202) 225-5772",
    "Fallon, Pat": "(202) 225-6673",
    "Fedorchak, Julie": "(202) 225-2611",
    "Feenstra, Randy": "(202) 225-4426",
    "Fields, Cleo": "(202) 225-3901",
    "Figures, Shomari": "(202) 225-4931",
    "Fine, Randy": "(202) 225-2706",
    "Finstad, Brad": "(202) 225-2472",
    "Fischbach, Michelle": "(202) 225-2165",
    "Fitzgerald, Scott": "(202) 225-5101",
    "Fitzpatrick, Brian": "(202) 225-4276",
    "Fleischmann, Charles": "(202) 225-3271",
    "Fletcher, Lizzie": "(202) 225-2571",
    "Flood, Mike": "(202) 225-4806",
    "Fong, Vince": "(202) 225-2915",
    "Foster, Bill": "(202) 225-3515",
    "Foushee, Valerie": "(202) 225-1784",
    "Foxx, Virginia": "(202) 225-2071",
    "Frankel, Lois": "(202) 225-9890",
    "Franklin, Scott": "(202) 225-1252",
    "Friedman, Laura": "(202) 225-4176",
    "Frost, Maxwell": "(202) 225-2176",
    "Fry, Russell": "(202) 225-9895",
    "Fulcher, Russ": "(202) 225-6611",
    "Garamendi, John": "(202) 225-1880",
    "Garbarino, Andrew": "(202) 225-7896",
    "Garcia, Jesus": "(202) 225-8203",
    "Garcia, Robert": "(202) 225-7924",
    "Garcia, Sylvia": "(202) 225-1688",
    "Gill, Brandon": "(202) 225-7772",
    "Gillen, Laura": "(202) 225-5516",
    "Gimenez, Carlos": "(202) 225-2778",
    "Golden, Jared": "(202) 225-6306",
    "Goldman, Craig": "(202) 225-5071",
    "Goldman, Daniel": "(202) 225-7944",
    "Gomez, Jimmy": "(202) 225-6235",
    "Gonzales, Tony": "(202) 225-4511",
    "Gonzalez, Vicente": "(202) 225-2531",
    "Gooden, Lance": "(202) 225-3484",
    "Goodlander, Maggie": "(202) 225-5206",
    "Gosar, Paul": "(202) 225-2315",
    "Gottheimer, Josh": "(202) 225-4465",
    "Graves, Sam": "(202) 225-7041",
    "Gray, Adam": "(202) 225-1947",
    "Green, Al": "(202) 225-7508",
    "Green, Mark": "(202) 225-2811",
    "Greene, Marjorie": "(202) 225-5211",
    "Griffith, H.": "(202) 225-3861",
    "Grijalva, Ra\u00fal M.- Vacancy": "(202) 225-2435",
    "Grothman, Glenn": "(202) 225-2476",
    "Guest, Michael": "(202) 225-5031",
    "Guthrie, Brett": "(202) 225-3501",
    "Hageman, Harriet": "(202) 225-2311",
    "Hamadeh, Abraham": "(202) 225-4576",
    "Harder, Josh": "(202) 225-4540",
    "Haridopolos, Mike": "(202) 225-3671",
    "Harrigan, Pat": "(202) 225-2576",
    "Harris, Andy": "(202) 225-5311",
    "Harris, Mark": "(202) 225-1976",
    "Harshbarger, Diana": "(202) 225-6356",
    "Hayes, Jahana": "(202) 225-4476",
    "Hern, Kevin": "(202) 225-2211",
    "Hernandez, Pablo": "(202) 225-2615",
    "Higgins, Clay": "(202) 225-2031",
    "Hill, J.": "(202) 225-2506",
    "Himes, James": "(202) 225-5541",
    "Hinson, Ashley": "(202) 225-2911",
    "Horsford, Steven": "(202) 225-9894",
    "Houchin, Erin": "(202) 225-5315",
    "Houlahan, Chrissy": "(202) 225-4315",
    "Hoyer, Steny": "(202) 225-4131",
    "Hoyle, Val": "(202) 225-6416",
    "Hudson, Richard": "(202) 225-3715",
    "Huffman, Jared": "(202) 225-5161",
    "Huizenga, Bill": "(202) 225-4401",
    "Hunt, Wesley": "(202) 225-5646",
    "Hurd, Jeff": "(202) 225-4676",
    "Issa, Darrell": "(202) 225-5672",
    "Ivey, Glenn": "(202) 225-8699",
    "Jack, Brian": "(202) 225-5901",
    "Jackson, Jonathan": "(202) 225-4372",
    "Jackson, Ronny": "(202) 225-3706",
    "Jacobs, Sara": "(202) 225-2040",
    "James, John": "(202) 225-4961",
    "Jayapal, Pramila": "(202) 225-3106",
    "Jeffries, Hakeem": "(202) 225-5936",
    "Johnson, Dusty": "(202) 225-2801",
    "Johnson, Henry": "(202) 225-1605",
    "Johnson, Julie": "(202) 225-2231",
    "Johnson, Mike": "(202) 225-2777",
    "Jordan, Jim": "(202) 225-2676",
    "Joyce, David": "(202) 225-5731",
    "Joyce, John": "(202) 225-2431",
    "Kamlager-Dove, Sydney": "(202) 225-7084",
    "Kaptur, Marcy": "(202) 225-4146",
    "Kean, Thomas": "(202) 225-5361",
    "Keating, William": "(202) 225-3111",
    "Kelly, Mike": "(202) 225-5406",
    "Kelly, Robin": "(202) 225-0773",
    "Kelly, Trent": "(202) 225-4306",
    "Kennedy, Mike": "(202) 225-7751",
    "Kennedy, Timothy": "(202) 225-3306",
    "Khanna, Ro": "(202) 225-2631",
    "Kiggans, Jennifer": "(202) 225-4215",
    "Kiley, Kevin": "(202) 225-2523",
    "Kim, Young": "(202) 225-4111",
    "King-Hinds, Kimberlyn": "(202) 225-2646",
    "Knott, Brad": "(202) 225-4531",
    "Krishnamoorthi, Raja": "(202) 225-3711",
    "Kustoff, David": "(202) 225-4714",
    "LaHood, Darin": "(202) 225-6201",
    "LaLota, Nick": "(202) 225-3826",
    "LaMalfa, Doug": "(202) 225-3076",
    "Landsman, Greg": "(202) 225-2216",
    "Langworthy, Nicholas": "(202) 225-3161",
    "Larsen, Rick": "(202) 225-2605",
    "Larson, John": "(202) 225-2265",
    "Latimer, George": "(202) 225-2464",
    "Latta, Robert": "(202) 225-6405",
    "Lawler, Michael": "(202) 225-6506",
    "Lee, Laurel": "(202) 225-5626",
    "Lee, Summer": "(202) 225-2135",
    "Lee, Susie": "(202) 225-3252",
    "Leger Fernandez, Teresa": "(202) 225-6190",
    "Letlow, Julia": "(202) 225-8490",
    "Levin, Mike": "(202) 225-3906",
    "Liccardo, Sam": "(202) 225-8104",
    "Lieu, Ted": "(202) 225-3976",
    "Lofgren, Zoe": "(202) 225-3072",
    "Loudermilk, Barry": "(202) 225-2931",
    "Lucas, Frank": "(202) 225-5565",
    "Luna, Anna Paulina": "(202) 225-5961",
    "Luttrell, Morgan": "(202) 225-4901",
    "Lynch, Stephen": "(202) 225-8273",
    "Mace, Nancy": "(202) 225-3176",
    "Mackenzie, Ryan": "(202) 225-6411",
    "Magaziner, Seth": "(202) 225-2735",
    "Malliotakis, Nicole": "(202) 225-3371",
    "Maloy, Celeste": "(202) 225-9730",
    "Mann, Tracey": "(202) 225-2715",
    "Mannion, John": "(202) 225-3701",
    "Massie, Thomas": "(202) 225-3465",
    "Mast, Brian": "(202) 225-3026",
    "Matsui, Doris": "(202) 225-7163",
    "McBath, Lucy": "(202) 225-4501",
    "McBride, Sarah": "(202) 225-4165",
    "McCaul, Michael": "(202) 225-2401",
    "McClain Delaney, April": "(202) 225-2721",
    "McClain, Lisa": "(202) 225-2106",
    "McClellan, Jennifer": "(202) 225-6365",
    "McClintock, Tom": "(202) 225-2511",
    "McCollum, Betty": "(202) 225-6631",
    "McCormick, Richard": "(202) 225-4272",
    "McDonald Rivet, Kristen": "(202) 225-3611",
    "McDowell, Addison": "(202) 225-3065",
    "McGarvey, Morgan": "(202) 225-5401",
    "McGovern, James": "(202) 225-6101",
    "McGuire, John": "(202) 225-4711",
    "McIver, LaMonica": "(202) 225-3436",
    "Meeks, Gregory": "(202) 225-3461",
    "Menendez, Robert": "(202) 225-7919",
    "Meng, Grace": "(202) 225-2601",
    "Messmer, Mark": "(202) 225-4636",
    "Meuser, Daniel": "(202) 225-6511",
    "Mfume, Kweisi": "(202) 225-4741",
    "Miller, Carol": "(202) 225-3452",
    "Miller, Mary": "(202) 225-5271",
    "Miller, Max": "(202) 225-3876",
    "Miller-Meeks, Mariannette": "(202) 225-6576",
    "Mills, Cory": "(202) 225-4035",
    "Min, Dave": "(202) 225-5611",
    "Moolenaar, John": "(202) 225-3561",
    "Moore, Barry": "(202) 225-2901",
    "Moore, Blake": "(202) 225-0453",
    "Moore, Gwen": "(202) 225-4572",
    "Moore, Riley": "(202) 225-2711",
    "Moore, Tim": "(202) 225-5634",
    "Moran, Nathaniel": "(202) 225-3035",
    "Morelle, Joseph": "(202) 225-3615",
    "Morrison, Kelly": "(202) 225-2871",
    "Moskowitz, Jared": "(202) 225-3001",
    "Moulton, Seth": "(202) 225-8020",
    "Moylan, James": "(202) 225-1188",
    "Mrvan, Frank": "(202) 225-2461",
    "Mullin, Kevin": "(202) 225-3531",
    "Murphy, Gregory": "(202) 225-3415",
    "Nadler, Jerrold": "(202) 225-5635",
    "Neal, Richard": "(202) 225-5601",
    "Neguse, Joe": "(202) 225-2161",
    "Nehls, Troy": "(202) 225-5951",
    "Newhouse, Dan": "(202) 225-5816",
    "Norcross, Donald": "(202) 225-6501",
    "Norman, Ralph": "(202) 225-5501",
    "Norton, Eleanor": "(202) 225-8050",
    "Nunn, Zachary": "(202) 225-5476",
    "Obernolte, Jay": "(202) 225-5861",
    "Ocasio-Cortez, Alexandria": "(202) 225-3965",
    "Ogles, Andrew": "(202) 225-4311",
    "Olszewski, Johnny": "(202) 225-3061",
    "Omar, Ilhan": "(202) 225-4755",
    "Onder, Robert": "(202) 225-2956",
    "Owens, Burgess": "(202) 225-3011",
    "Pallone, Frank": "(202) 225-4671",
    "Palmer, Gary": "(202) 225-4921",
    "Panetta, Jimmy": "(202) 225-2861",
    "Pappas, Chris": "(202) 225-5456",
    "Patronis, Jimmy": "(202) 225-4136",
    "Pelosi, Nancy": "(202) 225-4965",
    "Perez, Marie": "(202) 225-3536",
    "Perry, Scott": "(202) 225-5836",
    "Peters, Scott": "(202) 225-0508",
    "Pettersen, Brittany": "(202) 225-2645",
    "Pfluger, August": "(202) 225-3605",
    "Pingree, Chellie": "(202) 225-6116",
    "Plaskett, Stacey": "(202) 225-1790",
    "Pocan, Mark": "(202) 225-2906",
    "Pou, Nellie": "(202) 225-5751",
    "Pressley, Ayanna": "(202) 225-5111",
    "Quigley, Mike": "(202) 225-4061",
    "Radewagen, Aumua Amata": "(202) 225-8577",
    "Ramirez, Delia": "(202) 225-5701",
    "Randall, Emily": "(202) 225-5916",
    "Raskin, Jamie": "(202) 225-5341",
    "Reschenthaler, Guy": "(202) 225-2065",
    "Riley, Josh": "(202) 225-5441",
    "Rivas, Luz": "(202) 225-6131",
    "Rogers, Harold": "(202) 225-4601",
    "Rogers, Mike": "(202) 225-3261",
    "Rose, John": "(202) 225-4231",
    "Ross, Deborah": "(202) 225-3032",
    "Rouzer, David": "(202) 225-2731",
    "Roy, Chip": "(202) 225-4236",
    "Ruiz, Raul": "(202) 225-5330",
    "Rulli, Michael A.": "(202) 225-5705",
    "Rutherford, John": "(202) 225-2501",
    "Ryan, Patrick": "(202) 225-5614",
    "Salazar, Maria": "(202) 225-3931",
    "Salinas, Andrea": "(202) 225-5643",
    "Sanchez, Linda": "(202) 225-6676",
    "Scalise, Steve": "(202) 225-3015",
    "Scanlon, Mary Gay": "(202) 225-2011",
    "Schakowsky, Janice": "(202) 225-2111",
    "Schmidt, Derek": "(202) 225-6601",
    "Schneider, Bradley": "(202) 225-4835",
    "Scholten, Hillary": "(202) 225-3831",
    "Schrier, Kim": "(202) 225-7761",
    "Schweikert, David": "(202) 225-2190",
    "Scott, Austin": "(202) 225-6531",
    "Scott, David": "(202) 225-2939",
    "Scott, Robert": "(202) 225-8351",
    "Self, Keith": "(202) 225-4201",
    "Sessions, Pete": "(202) 225-6105",
    "Sewell, Terri": "(202) 225-2665",
    "Sherman, Brad": "(202) 225-5911",
    "Sherrill, Mikie": "(202) 225-5034",
    "Shreve, Jefferson": "(202) 225-3021",
    "Simon, Lateefah": "(202) 225-2661",
    "Simpson, Michael": "(202) 225-5531",
    "Smith, Adam": "(202) 225-8901",
    "Smith, Adrian": "(202) 225-6435",
    "Smith, Christopher": "(202) 225-3765",
    "Smith, Jason": "(202) 225-4404",
    "Smucker, Lloyd": "(202) 225-2411",
    "Sorensen, Eric": "(202) 225-5905",
    "Soto, Darren": "(202) 225-9889",
    "Spartz, Victoria": "(202) 225-2276",
    "Stansbury, Melanie": "(202) 225-6316",
    "Stanton, Greg": "(202) 225-9888",
    "Stauber, Pete": "(202) 225-6211",
    "Stefanik, Elise": "(202) 225-4611",
    "Steil, Bryan": "(202) 225-3031",
    "Steube, W.": "(202) 225-5792",
    "Stevens, Haley": "(202) 225-8171",
    "Strickland, Marilyn": "(202) 225-9740",
    "Strong, Dale": "(202) 225-4801",
    "Stutzman, Marlin": "(202) 225-4436",
    "Subramanyam, Suhas": "(202) 225-5136",
    "Suozzi, Thomas R.": "(202) 225-3335",
    "Swalwell, Eric": "(202) 225-5065",
    "Sykes, Emilia": "(202) 225-6265",
    "Takano, Mark": "(202) 225-2305",
    "Taylor, David": "(202) 225-3164",
    "Tenney, Claudia": "(202) 225-3665",
    "Thanedar, Shri": "(202) 225-5802",
    "Thompson, Bennie": "(202) 225-5876",
    "Thompson, Glenn": "(202) 225-5121",
    "Thompson, Mike": "(202) 225-3311",
    "Tiffany, Thomas": "(202) 225-3365",
    "Timmons, William": "(202) 225-6030",
    "Titus, Dina": "(202) 225-5965",
    "Tlaib, Rashida": "(202) 225-5126",
    "Tokuda, Jill": "(202) 225-4906",
    "Tonko, Paul": "(202) 225-5076",
    "Torres, Norma": "(202) 225-6161",
    "Torres, Ritchie": "(202) 225-4361",
    "Trahan, Lori": "(202) 225-3411",
    "Tran, Derek": "(202) 225-2415",
    "Turner, Michael": "(202) 225-6465",
    "Turner, Sylvester- Vacancy": "(202) 225-3816",
    "Underwood, Lauren": "(202) 225-2976",
    "Valadao, David": "(202) 225-4695",
    "Van Drew, Jefferson": "(202) 225-6572",
    "Van Duyne, Beth": "(202) 225-6605",
    "Van Orden, Derrick": "(202) 225-5506",
    "Vargas, Juan": "(202) 225-8045",
    "Vasquez, Gabe": "(202) 225-2365",
    "Veasey, Marc": "(202) 225-9897",
    "Velazquez, Nydia": "(202) 225-2361",
    "Vindman, Eugene": "(202) 225-2815",
    "Wagner, Ann": "(202) 225-1621",
    "Walberg, Tim": "(202) 225-6276",
    "Wasserman Schultz, Debbie": "(202) 225-7931",
    "Waters, Maxine": "(202) 225-2201",
    "Watson Coleman, Bonnie": "(202) 225-5801",
    "Weber, Randy": "(202) 225-2831",
    "Webster, Daniel": "(202) 225-1002",
    "Westerman, Bruce": "(202) 225-3772",
    "Whitesides, George": "(202) 225-1956",
    "Wied, Tony": "(202) 225-5665",
    "Williams, Nikema": "(202) 225-3801",
    "Williams, Roger": "(202) 225-9896",
    "Wilson, Frederica": "(202) 225-4506",
    "Wilson, Joe": "(202) 225-2452",
    "Wittman, Robert": "(202) 225-4261",
    "Womack, Steve": "(202) 225-4301",
    "Yakym, Rudy": "(202) 225-3915",
    "Zinke, Ryan": "(202) 225-5628"
  }

  const fetchReps = async () => {
    if (!stateCode) return;
    setLoading(true);
    setError(null);
    setMembers([]);

    try {
      const response = await api.get(`/members/${stateCode}`)
      setMembers(response.data.members || []);
      if (response.data.members.length === 0) {
        setSearch(false);
      }
      else {
        setSearch(true);
      }
    } catch (err) {
      setError("Could not fetch members for that state.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReps();
  };

  return (
    <div style={{ maxWidth: "100%", justifyContent: "center", textAlign: "center", padding: "20px" }}>
      <a href="/">
        <img 
          src="/RMRlogo.png" 
          alt="Logo" 
          style={{ display: "block", margin: "0 auto", width: search ? "50%" : "100%", paddingBottom: "20px" }} 
        />
      </a>
      <h2>Reach Out to Your State Representatives Now!</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "center", width: "100%" }}>
        <input
          type="text"
          maxLength="2"
          placeholder="Enter state code (e.g. MI)"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
          style={{ padding: "8px", width: "80%", marginRight: "8px" }}
        />
        <button type="submit" disabled={loading} style={{backgroundColor:"black", color: "white"}}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {members.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {members.map((member) => {
            if (member.name.at(-1) === ".") {
              member.name = member.name.substring(0, member.name.length - 3);
            }
            const phone = phoneBook[member.name] || "Phone number not available";

            return (
      <a href={`/members/${member.bioguideId}/reps`}>
        {console.log(member.bioguideId)}
      <li 
        key={member.bioguideId} 
        style={{ 
        marginBottom: "16px", 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "12px", 
        transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
        padding: "16px", 
        borderRadius: "8px",
        color: "black",
        position: "relative",
        overflow: "hidden", // to contain the arrow
        cursor: "pointer", // Change cursor to pointer on hover
        }}
        onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = member.partyName.includes("Republican") ? "rgb(179, 25, 25)" : ( member.partyName.includes("Democrat") ? "rgb(25, 79, 179)" : "rgb(25, 179, 25)");
        e.currentTarget.style.color = "white";
        e.currentTarget.style.transform = "translateX(-10px)";
        const arrow = document.createElement("span");
        arrow.innerHTML = "<img src='/triplearrows.png' alt='Arrow' style='width: 100px; height: 200px;' />";
        arrow.style.position = "absolute";
        arrow.style.right = "8px";
        arrow.style.top = "50%";
        arrow.style.transform = "translateY(-50%)";
        arrow.style.opacity = "0";
        arrow.style.transition = "opacity 0.3s ease-in";
        arrow.className = "hover-arrow";
        e.currentTarget.insertBefore(arrow, e.currentTarget.firstChild);
        requestAnimationFrame(() => arrow.style.opacity = "1");
        }}
        onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "black";
        e.currentTarget.style.transform = "translateX(0)";
        const arrow = e.currentTarget.querySelector(".hover-arrow");
        if (arrow) {
          arrow.style.opacity = "0";
        }
        }}
      >
              <img
              src={member.depiction?.imageUrl}
              alt={member.name}
              style={{ width: "100%", maxWidth: "200px", height: "auto", objectFit: "cover", borderRadius: "8px" }}
              />
              <div style={{ flex: "1", minWidth: "200px" }}>
              <h3>{member.name}</h3>
              <p><strong>Party:</strong> {member.partyName}</p>
              {member.district && <p><strong>District:</strong> {member.district}</p>}
              <p><strong>Chamber:</strong> {member.terms?.item?.[0]?.chamber}</p>
              <p><strong>Phone:</strong> {phone}</p>
              </div>
              </li>
              </a>
            );
            
          })}
        </ul>
      )}
    </div>
  );
};

export default StateRep;

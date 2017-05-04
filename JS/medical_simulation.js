
//silly helper function because i don't understand frontend development :)  Just makes sure
//we can see the values of sliders when we change them
function updateTextInput(val, name) {
          document.getElementById(name + "Output").value=val; 
        }

function sortNumber(a,b) {
    return a - b;
}

//draw from a standard normal distribution (mean = 0, sd = 1)
//see http://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function drawStandardNormal() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

//helper function to draw from a non-standard gaussian distribution with a given mean and sd
function drawNormal(mean, sd) {
    return drawStandardNormal() * sd + mean;
}

//another silly helper function- fills out the input dictionary with values
function populateInput(){

	//var urlParams = new URLSearchParams(window.location.search);
	var input= {};
	//for(var key of urlParams.keys()) {
	//	input[key] = urlParams.get(key)
	//	if(input[key] == "on") {
	//		input[key] = 1;
	//	}
	//}

	for(var element of document.getElementsByClassName("ms-input")){
		if(element.type == "radio"){
			if(element.checked){
				input[element.name] = element.value;	
			}
		} else if (element.type == "checkbox"){
			if(element.checked){
				input[element.name] = 1;	
			} else {
				input[element.name] = 0;
			}			
		} else {
			input[element.name] = element.value;
		}
	}
	console.log(input)

	//Note these values must match the column names in the R model
	//e.g. there is a RACE column in the R model, and we must name that term "RACE" in our input

	//Note also the levels must match- e.g. if R has levels 1, 2, 3, 14, 15, 16, those are the values
	//we must use in our select inputs as well

	//calculate BMI from height and weight 
	//see http://www.thecalculatorsite.com/articles/health/bmi-formula-for-bmi-calculations.php
	input["BMI"] = Math.abs(703 * input["WEIGHT"] / Math.pow(input["HEIGHT"], 2) - 22);
	input["BMI2"] = Math.pow(input["BMI"], 2);
	
	//Transform salary to log space as we do in the R model
	input["SALARY"] = Math.log(input["SALARY"] + 1);

	//Create dummy variable to introduce nonlieearity for childhood development
	input["LT5"]=(input["AGE"] < 5) ;
	input["LT10"]=(input["AGE"] < 10);
	input["MT21"]=(input["AGE"] > 21);

	//derive employment status from other inputs
	input["EMP"]=(input["SALARY"] > 0 && input["HOUR"] > 0);

	//It's weird to encode MALE as TRUE, so we just transform it here instead
	input["SEX"]= (input["SEX"] == "male") ? 1 : 0;

	return input;
}

//TODO: this should be moved to pull from a server-side JSON file.  This is copied from reg.json
function loadReg(){
	return JSON.parse('[{"coefficient":5.7118191,"_row":"intercept"},{"coefficient":0.37051526,"_row":"BORNUSATRUE"},{"coefficient":0.02669751,"_row":"AGE"},{"coefficient":0.00386059,"_row":"BMI"},{"coefficient":-0.04173176,"_row":"SEXTRUE"},{"coefficient":-0.17169312,"_row":"RACE2"},{"coefficient":-0.07324893,"_row":"RACE3"},{"coefficient":-0.0199615,"_row":"RACE4"},{"coefficient":0.1278432,"_row":"MARRY3"},{"coefficient":0.06748602,"_row":"MARRY4"},{"coefficient":0.03592124,"_row":"MARRY5"},{"coefficient":-0.05127251,"_row":"MARRY6"},{"coefficient":0.82857481,"_row":"CANCERTRUE"},{"coefficient":1.20860965,"_row":"DIABTRUE"},{"coefficient":0.03841797,"_row":"EDU1"},{"coefficient":0.08703419,"_row":"EDU2"},{"coefficient":0.07016228,"_row":"EDU14"},{"coefficient":0.1412765,"_row":"EDU15"},{"coefficient":0.30609197,"_row":"EDU16"},{"coefficient":-0.00574789,"_row":"HOUR"},{"coefficient":1.48159772,"_row":"PREGTRUE"},{"coefficient":-0.27043748,"_row":"EMPTRUE"},{"coefficient":0.29300893,"_row":"LT5TRUE"},{"coefficient":-0.0719929,"_row":"MT21TRUE"},{"coefficient":0.00503794,"_row":"EMPTRUE:SALARY"},{"coefficient":0.00935753,"_row":"RACE2:SALARY"},{"coefficient":-0.33828397,"_row":"RACE2:EMPTRUE"},{"coefficient":0.08713706,"_row":"RACE3:EMPTRUE"},{"coefficient":-0.25015361,"_row":"RACE4:EMPTRUE"},{"coefficient":-0.00030666,"_row":"RACE2:HOUR"},{"coefficient":0.00116804,"_row":"RACE4:HOUR"},{"coefficient":-0.00064687,"_row":"RACE6:HOUR"},{"coefficient":0.01145606,"_row":"DIABTRUE:MT21TRUE"},{"coefficient":-0.00577006,"_row":"AGE:DIABTRUE"},{"coefficient":0.36723875,"_row":"CANCERTRUE:MT21TRUE"},{"coefficient":-0.01001344,"_row":"AGE:CANCERTRUE"},{"coefficient":0.00036938,"_row":"AGE:BMI"},{"coefficient":0.00036958,"_row":"PREGTRUE:BMI2"},{"coefficient":-0.06859893,"_row":"AGE:LT5TRUE"},{"coefficient":-0.01367284,"_row":"AGE:LT10TRUE"},{"coefficient":0.10509925,"_row":"SEXTRUE:LT5TRUE"},{"coefficient":-0.09458024,"_row":"SEXTRUE:MT21TRUE"},{"coefficient":-0.00048413,"_row":"BMI:SEXTRUE"},{"coefficient":0.00018793,"_row":"SEXTRUE:BMI2"},{"coefficient":-0.2528542,"_row":"EDU1:MT21TRUE"},{"coefficient":-0.23954,"_row":"EDU2:MT21TRUE"},{"coefficient":-0.0061446,"_row":"EDU13:MT21TRUE"},{"coefficient":0.13959821,"_row":"EDU14:MT21TRUE"},{"coefficient":0.14596183,"_row":"EDU15:MT21TRUE"},{"coefficient":0.20300872,"_row":"EDU16:MT21TRUE"},{"coefficient":0.0675783,"_row":"RACE2:EDU1"},{"coefficient":0.16031546,"_row":"RACE3:EDU1"},{"coefficient":-0.10676456,"_row":"RACE4:EDU1"},{"coefficient":0.1441062,"_row":"RACE6:EDU1"},{"coefficient":0.11929083,"_row":"RACE2:EDU2"},{"coefficient":-0.10636505,"_row":"RACE3:EDU2"},{"coefficient":-0.11790017,"_row":"RACE6:EDU2"},{"coefficient":0.11020397,"_row":"RACE2:EDU13"},{"coefficient":-0.00094183,"_row":"RACE4:EDU13"},{"coefficient":0.56506431,"_row":"RACE6:EDU13"},{"coefficient":-0.08320317,"_row":"RACE2:EDU14"},{"coefficient":0.59719993,"_row":"RACE3:EDU14"},{"coefficient":0.09770357,"_row":"RACE4:EDU14"},{"coefficient":0.01640091,"_row":"RACE2:EDU15"},{"coefficient":0.32765095,"_row":"RACE3:EDU15"},{"coefficient":-0.02503894,"_row":"RACE4:EDU15"},{"coefficient":-0.00437086,"_row":"RACE2:EDU16"},{"coefficient":1.55434283,"_row":"RACE3:EDU16"},{"coefficient":-0.00335723,"_row":"RACE4:EDU16"},{"coefficient":0.02848301,"_row":"RACE2:MT21TRUE"},{"coefficient":0.2634568,"_row":"RACE3:MT21TRUE"},{"coefficient":-0.09515844,"_row":"RACE4:MT21TRUE"},{"coefficient":0.07419043,"_row":"RACE6:MT21TRUE"},{"coefficient":0.01497955,"_row":"RACE2:EMPTRUE:SALARY"},{"coefficient":0.0000496,"_row":"RACE2:HOUR:SALARY"},{"coefficient":-0.00081406,"_row":"RACE3:HOUR:SALARY"},{"coefficient":0.0004878,"_row":"RACE4:HOUR:SALARY"},{"coefficient":-0.00137192,"_row":"RACE2:HOUR:EMPTRUE"},{"coefficient":1.3558782e-06,"_row":"RACE4:HOUR:EMPTRUE"},{"coefficient":-0.00408682,"_row":"RACE6:HOUR:EMPTRUE"},{"coefficient":-0.00036672,"_row":"AGE:DIABTRUE:MT21TRUE"},{"coefficient":-0.0026568,"_row":"AGE:CANCERTRUE:DIABTRUE"},{"coefficient":-0.00049371,"_row":"AGE:BMI:PREGTRUE"},{"coefficient":-0.01392117,"_row":"AGE:SEXTRUE:LT5TRUE"},{"coefficient":0.01261023,"_row":"AGE:SEXTRUE:LT10TRUE"},{"coefficient":0.00055014,"_row":"AGE:SEXTRUE:MT21TRUE"},{"coefficient":-0.00202425,"_row":"AGE:BMI:LT5TRUE"},{"coefficient":-0.00125555,"_row":"AGE:BMI:LT10TRUE"},{"coefficient":-6.9030697e-15,"_row":"AGE:LT10TRUE:BMI2"},{"coefficient":-2.27027705e-06,"_row":"AGE:MT21TRUE:BMI2"},{"coefficient":0.01246259,"_row":"BMI:SEXTRUE:LT5TRUE"},{"coefficient":1.67779626e-14,"_row":"SEXTRUE:LT5TRUE:BMI2"},{"coefficient":-0.00256743,"_row":"BMI:SEXTRUE:MT21TRUE"},{"coefficient":0.17867221,"_row":"RACE2:EDU1:MT21TRUE"},{"coefficient":-0.97189698,"_row":"RACE3:EDU1:MT21TRUE"},{"coefficient":0.58610844,"_row":"RACE4:EDU1:MT21TRUE"},{"coefficient":0.2371598,"_row":"RACE6:EDU1:MT21TRUE"},{"coefficient":0.20823118,"_row":"RACE2:EDU2:MT21TRUE"},{"coefficient":-0.22303646,"_row":"RACE4:EDU2:MT21TRUE"},{"coefficient":0.25554015,"_row":"RACE6:EDU2:MT21TRUE"},{"coefficient":0.0574928,"_row":"RACE4:EDU13:MT21TRUE"},{"coefficient":-0.22804899,"_row":"RACE6:EDU13:MT21TRUE"},{"coefficient":0.09024015,"_row":"RACE2:EDU14:MT21TRUE"},{"coefficient":0.03452714,"_row":"RACE3:EDU14:MT21TRUE"},{"coefficient":0.00822568,"_row":"RACE2:EDU15:MT21TRUE"},{"coefficient":0.01190776,"_row":"RACE3:EDU15:MT21TRUE"},{"coefficient":-0.02867854,"_row":"RACE4:EDU15:MT21TRUE"},{"coefficient":0.03416423,"_row":"RACE6:EDU15:MT21TRUE"},{"coefficient":0.3653677,"_row":"RACE3:EDU16:MT21TRUE"},{"coefficient":-0.0031447,"_row":"RACE4:EDU16:MT21TRUE"},{"coefficient":0.00008839,"_row":"RACE2:HOUR:EMPTRUE:SALARY"},{"coefficient":-0.0077361,"_row":"AGE:BMI:SEXTRUE:LT5TRUE"},{"coefficient":0.00104059,"_row":"AGE:BMI:SEXTRUE:LT10TRUE"},{"coefficient":5.29818422e-15,"_row":"AGE:SEXTRUE:LT10TRUE:BMI2"},{"coefficient":4.41846503e-07,"_row":"AGE:SEXTRUE:MT21TRUE:BMI2"}]');
}
//TODO: this should be moved to pull from a server-side JSON file.  This is copied from varreg.json
function loadVarreg(){
	return JSON.parse('[{"coefficient":0.87628473,"_row":"intercept"},{"coefficient":-0.02326797,"_row":"BORNUSATRUE"},{"coefficient":-0.00080628,"_row":"AGE"},{"coefficient":-0.01846794,"_row":"RACE4"},{"coefficient":0.01086447,"_row":"RACE6"},{"coefficient":-0.00563395,"_row":"MARRY1"},{"coefficient":-0.01677739,"_row":"MARRY2"},{"coefficient":0.05255036,"_row":"MARRY3"},{"coefficient":0.04154195,"_row":"MARRY4"},{"coefficient":0.04305945,"_row":"MARRY5"},{"coefficient":0.06863026,"_row":"CANCERTRUE"},{"coefficient":-0.00389103,"_row":"EDU1"},{"coefficient":0.02669358,"_row":"EDU2"},{"coefficient":0.00563248,"_row":"EDU13"},{"coefficient":-0.03284735,"_row":"EDU15"},{"coefficient":-0.0428974,"_row":"EDU16"},{"coefficient":-0.00036233,"_row":"HOUR"},{"coefficient":-5.45642114e-07,"_row":"SALARY"},{"coefficient":-0.05174623,"_row":"LT10TRUE"},{"coefficient":0.08146424,"_row":"MT21TRUE"},{"coefficient":0.00004858,"_row":"BMI2"},{"coefficient":-0.00084755,"_row":"EMPTRUE:SALARY"},{"coefficient":-0.00050581,"_row":"HOUR:EMPTRUE"},{"coefficient":-0.00109045,"_row":"AGE:DIABTRUE"},{"coefficient":0.00836239,"_row":"CANCERTRUE:MT21TRUE"},{"coefficient":-0.00172019,"_row":"AGE:CANCERTRUE"},{"coefficient":0.00078581,"_row":"AGE:PREGTRUE"},{"coefficient":-0.00002443,"_row":"AGE:BMI"},{"coefficient":-0.0001861,"_row":"PREGTRUE:BMI2"},{"coefficient":-0.01997209,"_row":"AGE:LT5TRUE"},{"coefficient":-0.00800806,"_row":"AGE:LT10TRUE"},{"coefficient":0.00285976,"_row":"SEXTRUE:LT5TRUE"},{"coefficient":0.0445576,"_row":"SEXTRUE:MT21TRUE"},{"coefficient":-0.00117158,"_row":"BMI:LT10TRUE"},{"coefficient":0.0010097,"_row":"BMI:MT21TRUE"},{"coefficient":0.02041449,"_row":"EDU2:MT21TRUE"},{"coefficient":-0.02576368,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.020869,"_row":"EDU16:MT21TRUE"},{"coefficient":-0.05360626,"_row":"RACE3:EDU1"},{"coefficient":-0.00196146,"_row":"RACE4:EDU1"},{"coefficient":0.06977811,"_row":"RACE3:EDU2"},{"coefficient":0.02962163,"_row":"RACE6:EDU2"},{"coefficient":-0.02656181,"_row":"RACE4:EDU13"},{"coefficient":-0.03844104,"_row":"RACE4:EDU14"},{"coefficient":0.03571612,"_row":"RACE6:EDU14"},{"coefficient":0.00181934,"_row":"RACE2:EDU15"},{"coefficient":0.53835521,"_row":"RACE3:EDU16"},{"coefficient":-0.00999486,"_row":"RACE4:EDU16"},{"coefficient":0.03047545,"_row":"RACE2:MT21TRUE"},{"coefficient":0.04904807,"_row":"RACE3:MT21TRUE"},{"coefficient":0.01673108,"_row":"RACE6:MT21TRUE"},{"coefficient":-0.00033433,"_row":"RACE2:EMPTRUE:SALARY"},{"coefficient":-5.02382889e-06,"_row":"RACE4:HOUR:SALARY"},{"coefficient":-7.85232815e-06,"_row":"AGE:CANCERTRUE:MT21TRUE"},{"coefficient":-0.00001457,"_row":"AGE:BMI:MT21TRUE"},{"coefficient":0.00167721,"_row":"BMI:SEXTRUE:LT5TRUE"},{"coefficient":-2.83199148e-06,"_row":"AGE:SEXTRUE:BMI2"},{"coefficient":0.07469922,"_row":"RACE2:EDU1:MT21TRUE"},{"coefficient":0.04886256,"_row":"RACE4:EDU1:MT21TRUE"},{"coefficient":0.23632585,"_row":"RACE6:EDU1:MT21TRUE"},{"coefficient":-0.03471702,"_row":"RACE2:EDU2:MT21TRUE"},{"coefficient":0.14242845,"_row":"RACE4:EDU2:MT21TRUE"},{"coefficient":0.06890856,"_row":"RACE2:EDU13:MT21TRUE"},{"coefficient":0.07619178,"_row":"RACE6:EDU13:MT21TRUE"},{"coefficient":0.00244886,"_row":"RACE2:EDU15:MT21TRUE"},{"coefficient":0.00005847,"_row":"RACE3:EDU16:MT21TRUE"},{"coefficient":-0.00313089,"_row":"RACE4:EDU16:MT21TRUE"},{"coefficient":-0.00001217,"_row":"RACE4:HOUR:EMPTRUE:SALARY"},{"coefficient":-5.80814878e-09,"_row":"AGE:SEXTRUE:MT21TRUE:BMI2"}]');
}
//TODO: this should be moved to pull from a server-side JSON file.  This is copied from zeroreg.json
function loadZeroreg(){
	return JSON.parse('[{"coefficient":-0.34123827,"_row":"intercept"},{"coefficient":-0.74782104,"_row":"BORNUSATRUE"},{"coefficient":-0.02745342,"_row":"AGE"},{"coefficient":0.15389843,"_row":"SEXTRUE"},{"coefficient":0.26953653,"_row":"RACE2"},{"coefficient":0.32915516,"_row":"MARRY5"},{"coefficient":-0.27428795,"_row":"MARRY6"},{"coefficient":-1.00043299,"_row":"CANCERTRUE"},{"coefficient":-1.55901305,"_row":"DIABTRUE"},{"coefficient":0.44908151,"_row":"EDU13"},{"coefficient":-0.34647302,"_row":"EDU16"},{"coefficient":0.00328205,"_row":"HOUR"},{"coefficient":-1.54979907,"_row":"PREGTRUE"},{"coefficient":0.06841523,"_row":"EMPTRUE"},{"coefficient":-0.00086227,"_row":"SALARY"},{"coefficient":-0.46519102,"_row":"LT5TRUE"},{"coefficient":-0.1412764,"_row":"LT10TRUE"},{"coefficient":0.14585551,"_row":"MT21TRUE"},{"coefficient":-0.00121646,"_row":"EMPTRUE:SALARY"},{"coefficient":0.00007498,"_row":"HOUR:EMPTRUE"},{"coefficient":0.02336412,"_row":"RACE4:EMPTRUE"},{"coefficient":-0.00074193,"_row":"AGE:DIABTRUE"},{"coefficient":-0.00038825,"_row":"AGE:BMI"},{"coefficient":-0.13621429,"_row":"SEXTRUE:LT10TRUE"},{"coefficient":0.49482421,"_row":"SEXTRUE:MT21TRUE"},{"coefficient":-0.00006728,"_row":"BMI:LT5TRUE"},{"coefficient":-7.84638326e-08,"_row":"LT5TRUE:BMI2"},{"coefficient":0.65750255,"_row":"EDU1:MT21TRUE"},{"coefficient":0.53012753,"_row":"EDU2:MT21TRUE"},{"coefficient":-0.35663726,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.14463465,"_row":"EDU16:MT21TRUE"},{"coefficient":-0.02877652,"_row":"RACE4:EDU1"},{"coefficient":0.02192628,"_row":"RACE2:EDU14"},{"coefficient":-0.15883148,"_row":"RACE6:EDU15"},{"coefficient":0.01553796,"_row":"RACE4:EDU16"},{"coefficient":-0.00668994,"_row":"BMI:SEXTRUE:LT10TRUE"},{"coefficient":-1.47500709e-06,"_row":"SEXTRUE:LT10TRUE:BMI2"},{"coefficient":-0.26741426,"_row":"RACE2:EDU1:MT21TRUE"},{"coefficient":-0.17200523,"_row":"RACE2:EDU2:MT21TRUE"},{"coefficient":0.00366836,"_row":"RACE2:EDU14:MT21TRUE"},{"coefficient":-0.00405492,"_row":"RACE6:EDU15:MT21TRUE"}]');
}

//loops through model parameters as output by the R toJSON package and look for matching params
//in the input dictionary.  Once you find matching values, multiply the coefficient by the
//value to come up with our model prediction

//this is equivalent to predict(model, newdate=input) in R
function predict(model, input) {
	var result = 0;

	//loop through every model term
	for(i in model){
		var termresult = model[i]["coefficient"]

		//For interaction terms, we need to find the term for each piece and multiply them together
		for(var term of model[i]["_row"].split(":"))
		{
			if(term.includes("TRUE")){
				//subtract out the level for boolean vars
				//e.g. BORNUSATRUE -> BORNUSA
				term = term.substr(0, term.length - "TRUE".length);
			}			
			val = parseFloat(input[term])
			//special case intercept, which always applies 
			if(term == "intercept"){
				val = 1;
			}
			if(isNaN(val)){
				//if we failed to parseInt() on input term, the term may just be a boolean, which
				//doesn't coerce to 1 in parseInt
				if(input[term] == true){
					val = 1;
				}
			}
			if(isNaN(val)){
				//if we didn't find the term, loop through the input for a term that is the same,
				//but followed by a numeric level. e.g. RACE is encoded in R as separate columns
				//with RACE1 = false, RACE2 = false, RACE3 = true, etc.  
				for(iterm in input){
					if(term.includes(iterm))
					{
						//if we found a factored variable, we need to check that the term matches
						//the correct level.  If not, the input term doesn't match the specified
						//level in R, and we set val to zero
						val = (input[iterm]) == parseInt(term.substr(iterm.length) || input[iterm] == true) ? 1 : 0
						break;
					}
				}
			}
			if(isNaN(val)){
				//This is ok if it's one of the unchecked condition checkboxes
				//e.g. if you don't check "Pegnant", rather than input["PREG"] == false,
				//it just won't be included in the input dictionary.  Default to 0.
				//console.log("Failed to find input term for " + term);
				val = 0;
			}
			termresult *= val
		}
		//console.log(model[i]["_row"] + " value: " + termresult)
		result += termresult;
	}
	//console.log("Result: " + result)
	return result
}

//function simulates a given number of iterations
function simulate(pred, varpred, zeropred, iterations){
	sim = new Array(iterations);
	for(i =0; i<iterations; i++){
		//account for inflation of 3% a year from 2014 data to 2017
		sim[i] = (Math.exp(drawNormal(pred, varpred)) - 1) * Math.pow(1.03, 3);
		if (Math.random() < zeropred){
			sim[i] = 0
		}
	}
	return sim;
}

function run(){
	input = populateInput();
	pred = predict(reg, input)
	
	//we actually predict the log of variance in log space, and what we want 
	//is the standard deviation in log space, so we have to transform it
	varpred = Math.pow((Math.exp(predict(varreg, input)) - 1), 0.5)

	//Logistic regression means we transform with the logit function
	zeropred =  1/(1+Math.exp(-predict(zeroreg, input)))

	//run the simulation!!!  Sort the output to make median calculation easy later
	sim = simulate(pred, varpred, zeropred, 1000).sort(sortNumber)

	//output the model results- this should only be for error checking, should be removed from final version
	document.getElementById("pred").innerHTML = "Lognormal distribution mean: " + pred
	document.getElementById("varpred").innerHTML = "Lognormal distribution standard deviation: " + varpred
	document.getElementById("zeropred").innerHTML = Math.round(100.0 * zeropred) + "% of people like you spend $0 at the doctor"

	//calculate mean, median, etc. since javascript is less cool than R
	var max = 10000
	z = 0;
	total = 0;
	m = 0;
	for(i=0;i<sim.length;i++){
		total += sim[i]
		if(sim[i] == 0){
			z++;
		}
		if(sim[i] > max){
			m++;
		}
	}
	//console.log(sim)
	//Should basically match the values output by the R shiny app
	document.getElementById("mean").innerHTML = "Mean: " + Math.round(total/sim.length)
	document.getElementById("median").innerHTML = "Median: " + Math.round(sim[Math.round(sim.length / 2)]) 
	document.getElementById("zeropercent").innerHTML = "Zeroes: " + z 
	document.getElementById("maxpercent").innerHTML = "Above " + max + ": " + m

	//do some basic plotting
	buckets = 40
	var trace = {
	  x: sim,
	  type: 'histogram',
	  xbins: {
	    end: max, 
	    size: (max + 1)/buckets, 
	    start: sim[0]
	  }
	};
	var data = [trace];
	Plotly.newPlot('myDiv', data);
}

reg = loadReg();
varreg = loadVarreg();
zeroreg = loadZeroreg();
run();

for(var element of document.getElementsByClassName("ms-input")){
	element.addEventListener("change", function (e) {
	    run();
	});		
}

//http://extoxnet.orst.edu/faqs/dietcancer/web2/twohowto.html

//silly helper function because i don't understand frontend development :)  Just makes sure
//we can see the values of sliders when we change them
function updateTextInput(val, name) {
          document.getElementById(name + "Output").value=val; 
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
	var urlParams = new URLSearchParams(window.location.search);
	var input= {};
	for(var key of urlParams.keys()) {
		input[key] = urlParams.get(key)
		if(input[key] == "on") {
			input[key] = 1;
		}
	}
	//Note these values must match the column names in the R model
	//e.g. there is a RACE column in the R model, and we must name that term "RACE" in our input

	//Note also the levels must match- e.g. if R has levels 1, 2, 3, 14, 15, 16, those are the values
	//we must use in our select inputs as well

	//calculate BMI from height and weight 
	//see http://www.thecalculatorsite.com/articles/health/bmi-formula-for-bmi-calculations.php
	input["BMI"] = Math.pow(703 * input["WEIGHT"] / Math.pow(input["HEIGHT"], 2) - 22, 2);
	
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
	return JSON.parse('[{"coefficient":5.70996111,"_row":"intercept"},{"coefficient":0.39796935,"_row":"BORNUSATRUE"},{"coefficient":0.02875494,"_row":"AGE"},{"coefficient":0.000648,"_row":"BMI"},{"coefficient":-0.00600166,"_row":"SEXTRUE"},{"coefficient":-0.12459481,"_row":"RACE2"},{"coefficient":0.06367549,"_row":"RACE3"},{"coefficient":-0.10339147,"_row":"RACE4"},{"coefficient":0.05890833,"_row":"RACE6"},{"coefficient":0,"_row":"MARRY1"},{"coefficient":-0.03561335,"_row":"MARRY2"},{"coefficient":0.14282849,"_row":"MARRY3"},{"coefficient":0.08310595,"_row":"MARRY4"},{"coefficient":0.02183387,"_row":"MARRY5"},{"coefficient":-0.09153646,"_row":"MARRY6"},{"coefficient":0.53429721,"_row":"CANCERTRUE"},{"coefficient":0.87663758,"_row":"DIABTRUE"},{"coefficient":0.05915528,"_row":"EDU1"},{"coefficient":0.0837489,"_row":"EDU2"},{"coefficient":0.00033381,"_row":"EDU13"},{"coefficient":0.03419076,"_row":"EDU14"},{"coefficient":0.11656163,"_row":"EDU15"},{"coefficient":0.28819469,"_row":"EDU16"},{"coefficient":-0.00556507,"_row":"HOUR"},{"coefficient":1.42045423,"_row":"PREGTRUE"},{"coefficient":-0.35574602,"_row":"EMPTRUE"},{"coefficient":0.0046675,"_row":"SALARY"},{"coefficient":0.3689195,"_row":"LT5TRUE"},{"coefficient":0,"_row":"LT10TRUE"},{"coefficient":-0.06604262,"_row":"MT21TRUE"},{"coefficient":0.00562558,"_row":"EMPTRUE:SALARY"},{"coefficient":0,"_row":"HOUR:SALARY"},{"coefficient":0,"_row":"HOUR:EMPTRUE"},{"coefficient":0,"_row":"SEXTRUE:PREGTRUE"},{"coefficient":-0.00183738,"_row":"AGE:SEXTRUE"},{"coefficient":0,"_row":"AGE:PREGTRUE"},{"coefficient":-5.02172259e-06,"_row":"AGE:BMI"},{"coefficient":-0.10252615,"_row":"AGE:LT5TRUE"},{"coefficient":-0.01106469,"_row":"AGE:LT10TRUE"},{"coefficient":-0.21973444,"_row":"EDU1:MT21TRUE"},{"coefficient":-0.15875602,"_row":"EDU2:MT21TRUE"},{"coefficient":0,"_row":"EDU13:MT21TRUE"},{"coefficient":0.1557261,"_row":"EDU14:MT21TRUE"},{"coefficient":0.13125626,"_row":"EDU15:MT21TRUE"},{"coefficient":0.18137569,"_row":"EDU16:MT21TRUE"},{"coefficient":0,"_row":"HOUR:EMPTRUE:SALARY"},{"coefficient":0,"_row":"AGE:SEXTRUE:PREGTRUE"}]');
}
//TODO: this should be moved to pull from a server-side JSON file.  This is copied from varreg.json
function loadVarreg(){
	return JSON.parse('[{"coefficient":0.90355848,"_row":"intercept"},{"coefficient":-0.02337993,"_row":"BORNUSATRUE"},{"coefficient":-0.00195205,"_row":"AGE"},{"coefficient":0.0000387,"_row":"BMI"},{"coefficient":0.00539514,"_row":"SEXTRUE"},{"coefficient":0.03325398,"_row":"RACE2"},{"coefficient":0.01377833,"_row":"RACE3"},{"coefficient":-0.02687511,"_row":"RACE4"},{"coefficient":0.04872036,"_row":"RACE6"},{"coefficient":-0.0241324,"_row":"MARRY1"},{"coefficient":-0.0399258,"_row":"MARRY2"},{"coefficient":0.04345616,"_row":"MARRY3"},{"coefficient":0.03212915,"_row":"MARRY4"},{"coefficient":0.03127727,"_row":"MARRY5"},{"coefficient":0,"_row":"MARRY6"},{"coefficient":-0.01598482,"_row":"CANCERTRUE"},{"coefficient":-0.06080904,"_row":"DIABTRUE"},{"coefficient":-0.03183043,"_row":"EDU1"},{"coefficient":0.01900084,"_row":"EDU2"},{"coefficient":0,"_row":"EDU13"},{"coefficient":-0.02086548,"_row":"EDU14"},{"coefficient":-0.03559246,"_row":"EDU15"},{"coefficient":-0.03647639,"_row":"EDU16"},{"coefficient":-0.000043,"_row":"HOUR"},{"coefficient":0,"_row":"PREGTRUE"},{"coefficient":0,"_row":"EMPTRUE"},{"coefficient":-0.00013508,"_row":"SALARY"},{"coefficient":0.05262011,"_row":"LT5TRUE"},{"coefficient":-0.13170993,"_row":"LT10TRUE"},{"coefficient":0.15832131,"_row":"MT21TRUE"},{"coefficient":-0.00145601,"_row":"EMPTRUE:SALARY"},{"coefficient":0.00001024,"_row":"HOUR:SALARY"},{"coefficient":-0.00102195,"_row":"HOUR:EMPTRUE"},{"coefficient":0,"_row":"SEXTRUE:PREGTRUE"},{"coefficient":0.00049645,"_row":"AGE:SEXTRUE"},{"coefficient":0.00012678,"_row":"AGE:PREGTRUE"},{"coefficient":0,"_row":"AGE:BMI"},{"coefficient":-0.03261057,"_row":"AGE:LT5TRUE"},{"coefficient":0,"_row":"AGE:LT10TRUE"},{"coefficient":0.01151348,"_row":"EDU1:MT21TRUE"},{"coefficient":0,"_row":"EDU2:MT21TRUE"},{"coefficient":0,"_row":"EDU13:MT21TRUE"},{"coefficient":-0.01008402,"_row":"EDU14:MT21TRUE"},{"coefficient":-0.05530347,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.05739078,"_row":"EDU16:MT21TRUE"},{"coefficient":7.06478409e-06,"_row":"HOUR:EMPTRUE:SALARY"},{"coefficient":0,"_row":"AGE:SEXTRUE:PREGTRUE"}]');
}
//TODO: this should be moved to pull from a server-side JSON file.  This is copied from zeroreg.json
function loadZeroreg(){
	return JSON.parse('[{"coefficient":-0.41092198,"_row":"intercept"},{"coefficient":-0.75548254,"_row":"BORNUSATRUE"},{"coefficient":-0.03193096,"_row":"AGE"},{"coefficient":0,"_row":"BMI"},{"coefficient":0.33328327,"_row":"SEXTRUE"},{"coefficient":0.25437068,"_row":"RACE2"},{"coefficient":0,"_row":"RACE3"},{"coefficient":0,"_row":"RACE4"},{"coefficient":0,"_row":"RACE6"},{"coefficient":0,"_row":"MARRY1"},{"coefficient":0,"_row":"MARRY2"},{"coefficient":0,"_row":"MARRY3"},{"coefficient":0,"_row":"MARRY4"},{"coefficient":0.32941676,"_row":"MARRY5"},{"coefficient":-0.28522605,"_row":"MARRY6"},{"coefficient":-1.04019353,"_row":"CANCERTRUE"},{"coefficient":-1.64165346,"_row":"DIABTRUE"},{"coefficient":0,"_row":"EDU1"},{"coefficient":0,"_row":"EDU2"},{"coefficient":0.45605815,"_row":"EDU13"},{"coefficient":0,"_row":"EDU14"},{"coefficient":0,"_row":"EDU15"},{"coefficient":-0.24480389,"_row":"EDU16"},{"coefficient":0.00458254,"_row":"HOUR"},{"coefficient":-1.59972372,"_row":"PREGTRUE"},{"coefficient":0.08761488,"_row":"EMPTRUE"},{"coefficient":-0.0054518,"_row":"SALARY"},{"coefficient":-0.46973815,"_row":"LT5TRUE"},{"coefficient":-0.23839389,"_row":"LT10TRUE"},{"coefficient":0.420364,"_row":"MT21TRUE"},{"coefficient":-0.00270058,"_row":"EMPTRUE:SALARY"},{"coefficient":0,"_row":"HOUR:SALARY"},{"coefficient":0.00037712,"_row":"HOUR:EMPTRUE"},{"coefficient":0,"_row":"SEXTRUE:PREGTRUE"},{"coefficient":0.00363748,"_row":"AGE:SEXTRUE"},{"coefficient":-0.00261318,"_row":"AGE:PREGTRUE"},{"coefficient":-0.00001216,"_row":"AGE:BMI"},{"coefficient":0,"_row":"AGE:LT5TRUE"},{"coefficient":0,"_row":"AGE:LT10TRUE"},{"coefficient":0.6399155,"_row":"EDU1:MT21TRUE"},{"coefficient":0.4900629,"_row":"EDU2:MT21TRUE"},{"coefficient":0,"_row":"EDU13:MT21TRUE"},{"coefficient":0,"_row":"EDU14:MT21TRUE"},{"coefficient":-0.36749299,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.24395196,"_row":"EDU16:MT21TRUE"},{"coefficient":0,"_row":"HOUR:EMPTRUE:SALARY"},{"coefficient":0,"_row":"AGE:SEXTRUE:PREGTRUE"}]');
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

input = populateInput();

reg = loadReg();
varreg = loadVarreg();
zeroreg = loadZeroreg();

pred = predict(reg, input)
//we actually predict the log of variance in log space, and what we want 
//is the standard deviation in log space, so we have to transform it
varpred = Math.pow((Math.exp(predict(varreg, input)) - 1), 0.5)

//Logistic regression means we transform with the logit function
zeropred =  1/(1+Math.exp(-predict(zeroreg, input)))

//run the simulation!!!  Sort the output to make median calculation easy later
sim = simulate(pred, varpred, zeropred, 1000).sort()

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


//http://extoxnet.orst.edu/faqs/dietcancer/web2/twohowto.html
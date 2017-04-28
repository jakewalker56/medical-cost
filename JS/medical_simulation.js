
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
	return JSON.parse('[{"coefficient":5.69802495,"_row":"intercept"},{"coefficient":0.36972327,"_row":"BORNUSATRUE"},{"coefficient":0.02749043,"_row":"AGE"},{"coefficient":0.00385976,"_row":"BMI"},{"coefficient":-0.00980696,"_row":"SEXTRUE"},{"coefficient":-0.17011097,"_row":"RACE2"},{"coefficient":-0.08344222,"_row":"RACE3"},{"coefficient":-0.0209123,"_row":"RACE4"},{"coefficient":0.12983312,"_row":"MARRY3"},{"coefficient":0.07074403,"_row":"MARRY4"},{"coefficient":0.03428282,"_row":"MARRY5"},{"coefficient":-0.05121325,"_row":"MARRY6"},{"coefficient":0.81732209,"_row":"CANCERTRUE"},{"coefficient":1.20783046,"_row":"DIABTRUE"},{"coefficient":0.03791582,"_row":"EDU1"},{"coefficient":0.08947702,"_row":"EDU2"},{"coefficient":0.07568765,"_row":"EDU14"},{"coefficient":0.13630221,"_row":"EDU15"},{"coefficient":0.30032668,"_row":"EDU16"},{"coefficient":-0.00607585,"_row":"HOUR"},{"coefficient":1.43691165,"_row":"PREGTRUE"},{"coefficient":-0.26632958,"_row":"EMPTRUE"},{"coefficient":0.34138287,"_row":"LT5TRUE"},{"coefficient":-0.10060581,"_row":"MT21TRUE"},{"coefficient":0.00522857,"_row":"EMPTRUE:SALARY"},{"coefficient":0.01003311,"_row":"RACE2:SALARY"},{"coefficient":-0.34334306,"_row":"RACE2:EMPTRUE"},{"coefficient":0.08527978,"_row":"RACE3:EMPTRUE"},{"coefficient":-0.25132349,"_row":"RACE4:EMPTRUE"},{"coefficient":-0.00014018,"_row":"RACE2:HOUR"},{"coefficient":0.00129603,"_row":"RACE4:HOUR"},{"coefficient":-0.00045762,"_row":"RACE6:HOUR"},{"coefficient":-0.00159244,"_row":"AGE:SEXTRUE"},{"coefficient":0.01875527,"_row":"DIABTRUE:MT21TRUE"},{"coefficient":-0.00580585,"_row":"AGE:DIABTRUE"},{"coefficient":0.39753126,"_row":"CANCERTRUE:MT21TRUE"},{"coefficient":-0.01025164,"_row":"AGE:CANCERTRUE"},{"coefficient":-0.09648405,"_row":"AGE:LT5TRUE"},{"coefficient":-0.01045066,"_row":"AGE:LT10TRUE"},{"coefficient":0.00666346,"_row":"BMI:LT5TRUE"},{"coefficient":2.25758935e-13,"_row":"LT5TRUE:BMI2"},{"coefficient":0.00037391,"_row":"AGE:BMI"},{"coefficient":-0.2592835,"_row":"EDU1:MT21TRUE"},{"coefficient":-0.24992552,"_row":"EDU2:MT21TRUE"},{"coefficient":-0.0142404,"_row":"EDU13:MT21TRUE"},{"coefficient":0.12894749,"_row":"EDU14:MT21TRUE"},{"coefficient":0.14652727,"_row":"EDU15:MT21TRUE"},{"coefficient":0.20655485,"_row":"EDU16:MT21TRUE"},{"coefficient":0.06675107,"_row":"RACE2:EDU1"},{"coefficient":0.16235857,"_row":"RACE3:EDU1"},{"coefficient":-0.10330986,"_row":"RACE4:EDU1"},{"coefficient":0.14485371,"_row":"RACE6:EDU1"},{"coefficient":0.11595893,"_row":"RACE2:EDU2"},{"coefficient":-0.09993673,"_row":"RACE3:EDU2"},{"coefficient":-0.11837549,"_row":"RACE6:EDU2"},{"coefficient":0.11696399,"_row":"RACE2:EDU13"},{"coefficient":-0.00112376,"_row":"RACE4:EDU13"},{"coefficient":0.57315922,"_row":"RACE6:EDU13"},{"coefficient":-0.09363511,"_row":"RACE2:EDU14"},{"coefficient":0.59051325,"_row":"RACE3:EDU14"},{"coefficient":0.10693461,"_row":"RACE4:EDU14"},{"coefficient":0.01855489,"_row":"RACE2:EDU15"},{"coefficient":0.34486269,"_row":"RACE3:EDU15"},{"coefficient":-0.02828772,"_row":"RACE4:EDU15"},{"coefficient":1.54256705,"_row":"RACE3:EDU16"},{"coefficient":0.01802264,"_row":"RACE2:MT21TRUE"},{"coefficient":0.27449175,"_row":"RACE3:MT21TRUE"},{"coefficient":-0.10395536,"_row":"RACE4:MT21TRUE"},{"coefficient":0.07677519,"_row":"RACE6:MT21TRUE"},{"coefficient":0.01524762,"_row":"RACE2:EMPTRUE:SALARY"},{"coefficient":0.00006887,"_row":"RACE2:HOUR:SALARY"},{"coefficient":-0.00080941,"_row":"RACE3:HOUR:SALARY"},{"coefficient":0.00047674,"_row":"RACE4:HOUR:SALARY"},{"coefficient":-0.00124214,"_row":"RACE2:HOUR:EMPTRUE"},{"coefficient":5.58051861e-07,"_row":"RACE4:HOUR:EMPTRUE"},{"coefficient":-0.00424442,"_row":"RACE6:HOUR:EMPTRUE"},{"coefficient":-0.00043108,"_row":"AGE:DIABTRUE:MT21TRUE"},{"coefficient":-9.67105047e-06,"_row":"AGE:CANCERTRUE:MT21TRUE"},{"coefficient":-0.002666,"_row":"AGE:CANCERTRUE:DIABTRUE"},{"coefficient":-0.00116656,"_row":"AGE:BMI:LT5TRUE"},{"coefficient":-2.1823452e-06,"_row":"AGE:MT21TRUE:BMI2"},{"coefficient":0.1883436,"_row":"RACE2:EDU1:MT21TRUE"},{"coefficient":-0.97344334,"_row":"RACE3:EDU1:MT21TRUE"},{"coefficient":0.5936871,"_row":"RACE4:EDU1:MT21TRUE"},{"coefficient":0.23437422,"_row":"RACE6:EDU1:MT21TRUE"},{"coefficient":0.21928975,"_row":"RACE2:EDU2:MT21TRUE"},{"coefficient":-0.21270764,"_row":"RACE4:EDU2:MT21TRUE"},{"coefficient":0.24864472,"_row":"RACE6:EDU2:MT21TRUE"},{"coefficient":0.06883524,"_row":"RACE4:EDU13:MT21TRUE"},{"coefficient":-0.24148624,"_row":"RACE6:EDU13:MT21TRUE"},{"coefficient":0.10684744,"_row":"RACE2:EDU14:MT21TRUE"},{"coefficient":0.04598121,"_row":"RACE3:EDU14:MT21TRUE"},{"coefficient":0.01169833,"_row":"RACE2:EDU15:MT21TRUE"},{"coefficient":-0.01312687,"_row":"RACE4:EDU15:MT21TRUE"},{"coefficient":0.02984815,"_row":"RACE6:EDU15:MT21TRUE"},{"coefficient":0.36323977,"_row":"RACE3:EDU16:MT21TRUE"},{"coefficient":0.00004547,"_row":"RACE2:HOUR:EMPTRUE:SALARY"}]');
}
//TODO: this should be moved to pull from a server-side JSON file.  This is copied from varreg.json
function loadVarreg(){
	return JSON.parse('[{"coefficient":0.87666359,"_row":"intercept"},{"coefficient":-0.02436404,"_row":"BORNUSATRUE"},{"coefficient":-0.00094628,"_row":"AGE"},{"coefficient":0.00640429,"_row":"SEXTRUE"},{"coefficient":-0.01630913,"_row":"RACE4"},{"coefficient":0.01085703,"_row":"RACE6"},{"coefficient":-0.00938481,"_row":"MARRY1"},{"coefficient":-0.01889458,"_row":"MARRY2"},{"coefficient":0.04939797,"_row":"MARRY3"},{"coefficient":0.03725794,"_row":"MARRY4"},{"coefficient":0.04050098,"_row":"MARRY5"},{"coefficient":0.09305356,"_row":"CANCERTRUE"},{"coefficient":-0.0054586,"_row":"EDU1"},{"coefficient":0.02770645,"_row":"EDU2"},{"coefficient":0.00662701,"_row":"EDU13"},{"coefficient":-0.03632291,"_row":"EDU15"},{"coefficient":-0.04546173,"_row":"EDU16"},{"coefficient":-0.0001212,"_row":"HOUR"},{"coefficient":-0.0543142,"_row":"LT10TRUE"},{"coefficient":0.10421317,"_row":"MT21TRUE"},{"coefficient":0.00005612,"_row":"BMI2"},{"coefficient":-0.00097334,"_row":"EMPTRUE:SALARY"},{"coefficient":-0.00069364,"_row":"HOUR:EMPTRUE"},{"coefficient":0.0003946,"_row":"AGE:SEXTRUE"},{"coefficient":0.00008278,"_row":"AGE:PREGTRUE"},{"coefficient":-0.00110611,"_row":"AGE:DIABTRUE"},{"coefficient":0.01309326,"_row":"CANCERTRUE:MT21TRUE"},{"coefficient":-0.0021792,"_row":"AGE:CANCERTRUE"},{"coefficient":-0.01523519,"_row":"AGE:LT5TRUE"},{"coefficient":-0.00706041,"_row":"AGE:LT10TRUE"},{"coefficient":-0.00023178,"_row":"BMI:LT10TRUE"},{"coefficient":0.00032188,"_row":"BMI:MT21TRUE"},{"coefficient":-0.00005224,"_row":"AGE:BMI"},{"coefficient":0.02123111,"_row":"EDU2:MT21TRUE"},{"coefficient":-0.02397507,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.01946447,"_row":"EDU16:MT21TRUE"},{"coefficient":-0.05831824,"_row":"RACE3:EDU1"},{"coefficient":-0.00939058,"_row":"RACE4:EDU1"},{"coefficient":0.07423963,"_row":"RACE3:EDU2"},{"coefficient":0.03133261,"_row":"RACE6:EDU2"},{"coefficient":-0.03294859,"_row":"RACE4:EDU13"},{"coefficient":-0.0435678,"_row":"RACE4:EDU14"},{"coefficient":0.03558599,"_row":"RACE6:EDU14"},{"coefficient":0.00749274,"_row":"RACE2:EDU15"},{"coefficient":0.57854068,"_row":"RACE3:EDU16"},{"coefficient":-0.01387265,"_row":"RACE4:EDU16"},{"coefficient":0.03344262,"_row":"RACE2:MT21TRUE"},{"coefficient":0.05098671,"_row":"RACE3:MT21TRUE"},{"coefficient":0.01568552,"_row":"RACE6:MT21TRUE"},{"coefficient":-0.00070223,"_row":"RACE2:EMPTRUE:SALARY"},{"coefficient":-5.24719418e-06,"_row":"RACE4:HOUR:SALARY"},{"coefficient":-0.00095656,"_row":"AGE:BMI:LT5TRUE"},{"coefficient":-1.08948306e-15,"_row":"AGE:LT5TRUE:BMI2"},{"coefficient":-0.0003053,"_row":"AGE:BMI:LT10TRUE"},{"coefficient":-2.63568253e-16,"_row":"AGE:LT10TRUE:BMI2"},{"coefficient":-1.10608126e-07,"_row":"AGE:BMI:MT21TRUE"},{"coefficient":0.07771949,"_row":"RACE2:EDU1:MT21TRUE"},{"coefficient":0.05618368,"_row":"RACE4:EDU1:MT21TRUE"},{"coefficient":0.24591982,"_row":"RACE6:EDU1:MT21TRUE"},{"coefficient":-0.03877364,"_row":"RACE2:EDU2:MT21TRUE"},{"coefficient":0.14177717,"_row":"RACE4:EDU2:MT21TRUE"},{"coefficient":0.06847843,"_row":"RACE2:EDU13:MT21TRUE"},{"coefficient":0.08166117,"_row":"RACE6:EDU13:MT21TRUE"},{"coefficient":0.00049233,"_row":"RACE2:EDU15:MT21TRUE"},{"coefficient":2.57539711e-06,"_row":"RACE3:EDU16:MT21TRUE"},{"coefficient":-0.00243116,"_row":"RACE4:EDU16:MT21TRUE"},{"coefficient":-0.00001303,"_row":"RACE4:HOUR:EMPTRUE:SALARY"}]');
}
//TODO: this should be moved to pull from a server-side JSON file.  This is copied from zeroreg.json
function loadZeroreg(){
	return JSON.parse('[{"coefficient":-0.47307934,"_row":"intercept"},{"coefficient":-0.73626136,"_row":"BORNUSATRUE"},{"coefficient":-0.0288239,"_row":"AGE"},{"coefficient":0.34654826,"_row":"SEXTRUE"},{"coefficient":0.26700221,"_row":"RACE2"},{"coefficient":0.33603999,"_row":"MARRY5"},{"coefficient":-0.26243177,"_row":"MARRY6"},{"coefficient":-1.01333907,"_row":"CANCERTRUE"},{"coefficient":-1.54257662,"_row":"DIABTRUE"},{"coefficient":0.45482504,"_row":"EDU13"},{"coefficient":-0.27770069,"_row":"EDU16"},{"coefficient":0.00441872,"_row":"HOUR"},{"coefficient":-1.58300707,"_row":"PREGTRUE"},{"coefficient":0.06047403,"_row":"EMPTRUE"},{"coefficient":-0.00231141,"_row":"SALARY"},{"coefficient":-0.45710835,"_row":"LT5TRUE"},{"coefficient":-0.23244026,"_row":"LT10TRUE"},{"coefficient":0.40405543,"_row":"MT21TRUE"},{"coefficient":-0.00127342,"_row":"EMPTRUE:SALARY"},{"coefficient":0.00022217,"_row":"HOUR:EMPTRUE"},{"coefficient":0.0219855,"_row":"RACE4:EMPTRUE"},{"coefficient":0.00312289,"_row":"AGE:SEXTRUE"},{"coefficient":-0.00126872,"_row":"AGE:PREGTRUE"},{"coefficient":-0.00084367,"_row":"AGE:DIABTRUE"},{"coefficient":-0.00040474,"_row":"AGE:BMI"},{"coefficient":0.66428183,"_row":"EDU1:MT21TRUE"},{"coefficient":0.53367008,"_row":"EDU2:MT21TRUE"},{"coefficient":-0.36075244,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.22336261,"_row":"EDU16:MT21TRUE"},{"coefficient":-0.03722497,"_row":"RACE4:EDU1"},{"coefficient":-0.00643305,"_row":"RACE6:EDU2"},{"coefficient":0.0103251,"_row":"RACE2:EDU14"},{"coefficient":-0.14658691,"_row":"RACE6:EDU15"},{"coefficient":0.02666897,"_row":"RACE3:EDU16"},{"coefficient":0.03175867,"_row":"RACE4:EDU16"},{"coefficient":-0.27726613,"_row":"RACE2:EDU1:MT21TRUE"},{"coefficient":-0.17844063,"_row":"RACE2:EDU2:MT21TRUE"},{"coefficient":-0.00324378,"_row":"RACE6:EDU15:MT21TRUE"}]');
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
console.log(sim)
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
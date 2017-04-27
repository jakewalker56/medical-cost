function updateTextInput(val, name) {
          document.getElementById(name + "Output").value=val; 
        }

function cdf(x, mean, variance) {
  return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
}

function erf(x) {
  // save the sign of x
  var sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // constants
  var a1 =  0.254829592;
  var a2 = -0.284496736;
  var a3 =  1.421413741;
  var a4 = -1.453152027;
  var a5 =  1.061405429;
  var p  =  0.3275911;

  // A&S formula 7.1.26
  var t = 1.0/(1.0 + p*x);
  var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}

function populateInput(){
	var urlParams = new URLSearchParams(window.location.search);
	var input= {};
	for(var key of urlParams.keys()) {
		input[key] = urlParams.get(key)
		if(input[key] == "on") {
			input[key] = 1;
		}
	}

	input["BMI"] = Math.pow(703 * input["WEIGHT"] / Math.pow(input["HEIGHT"], 2) - 22, 2);
	input["SALARY"] = Math.log(input["SALARY"] + 1);
	input["LT5"]=(input["AGE"] < 5) ;
	input["LT10"]=(input["AGE"] < 10);
	input["MT21"]=(input["AGE"] > 21);
	input["EMP"]=(input["SALARY"] > 0 && input["HOUR"] > 0);
	input["SEX"]= (input["SEX"] == "male") ? 1 : 0;

	return input;
}
function loadReg(){
	return JSON.parse('[{"coefficient":5.70996111,"_row":"intercept"},{"coefficient":0.39796935,"_row":"BORNUSATRUE"},{"coefficient":0.02875494,"_row":"AGE"},{"coefficient":0.000648,"_row":"BMI"},{"coefficient":-0.00600166,"_row":"SEXTRUE"},{"coefficient":-0.12459481,"_row":"RACE2"},{"coefficient":0.06367549,"_row":"RACE3"},{"coefficient":-0.10339147,"_row":"RACE4"},{"coefficient":0.05890833,"_row":"RACE6"},{"coefficient":0,"_row":"MARRY1"},{"coefficient":-0.03561335,"_row":"MARRY2"},{"coefficient":0.14282849,"_row":"MARRY3"},{"coefficient":0.08310595,"_row":"MARRY4"},{"coefficient":0.02183387,"_row":"MARRY5"},{"coefficient":-0.09153646,"_row":"MARRY6"},{"coefficient":0.53429721,"_row":"CANCERTRUE"},{"coefficient":0.87663758,"_row":"DIABTRUE"},{"coefficient":0.05915528,"_row":"EDU1"},{"coefficient":0.0837489,"_row":"EDU2"},{"coefficient":0.00033381,"_row":"EDU13"},{"coefficient":0.03419076,"_row":"EDU14"},{"coefficient":0.11656163,"_row":"EDU15"},{"coefficient":0.28819469,"_row":"EDU16"},{"coefficient":-0.00556507,"_row":"HOUR"},{"coefficient":1.42045423,"_row":"PREGTRUE"},{"coefficient":-0.35574602,"_row":"EMPTRUE"},{"coefficient":0.0046675,"_row":"SALARY"},{"coefficient":0.3689195,"_row":"LT5TRUE"},{"coefficient":0,"_row":"LT10TRUE"},{"coefficient":-0.06604262,"_row":"MT21TRUE"},{"coefficient":0.00562558,"_row":"EMPTRUE:SALARY"},{"coefficient":0,"_row":"HOUR:SALARY"},{"coefficient":0,"_row":"HOUR:EMPTRUE"},{"coefficient":0,"_row":"SEXTRUE:PREGTRUE"},{"coefficient":-0.00183738,"_row":"AGE:SEXTRUE"},{"coefficient":0,"_row":"AGE:PREGTRUE"},{"coefficient":-5.02172259e-06,"_row":"AGE:BMI"},{"coefficient":-0.10252615,"_row":"AGE:LT5TRUE"},{"coefficient":-0.01106469,"_row":"AGE:LT10TRUE"},{"coefficient":-0.21973444,"_row":"EDU1:MT21TRUE"},{"coefficient":-0.15875602,"_row":"EDU2:MT21TRUE"},{"coefficient":0,"_row":"EDU13:MT21TRUE"},{"coefficient":0.1557261,"_row":"EDU14:MT21TRUE"},{"coefficient":0.13125626,"_row":"EDU15:MT21TRUE"},{"coefficient":0.18137569,"_row":"EDU16:MT21TRUE"},{"coefficient":0,"_row":"HOUR:EMPTRUE:SALARY"},{"coefficient":0,"_row":"AGE:SEXTRUE:PREGTRUE"}]');
}
function loadVarreg(){
	return JSON.parse('[{"coefficient":0.90355848,"_row":"intercept"},{"coefficient":-0.02337993,"_row":"BORNUSATRUE"},{"coefficient":-0.00195205,"_row":"AGE"},{"coefficient":0.0000387,"_row":"BMI"},{"coefficient":0.00539514,"_row":"SEXTRUE"},{"coefficient":0.03325398,"_row":"RACE2"},{"coefficient":0.01377833,"_row":"RACE3"},{"coefficient":-0.02687511,"_row":"RACE4"},{"coefficient":0.04872036,"_row":"RACE6"},{"coefficient":-0.0241324,"_row":"MARRY1"},{"coefficient":-0.0399258,"_row":"MARRY2"},{"coefficient":0.04345616,"_row":"MARRY3"},{"coefficient":0.03212915,"_row":"MARRY4"},{"coefficient":0.03127727,"_row":"MARRY5"},{"coefficient":0,"_row":"MARRY6"},{"coefficient":-0.01598482,"_row":"CANCERTRUE"},{"coefficient":-0.06080904,"_row":"DIABTRUE"},{"coefficient":-0.03183043,"_row":"EDU1"},{"coefficient":0.01900084,"_row":"EDU2"},{"coefficient":0,"_row":"EDU13"},{"coefficient":-0.02086548,"_row":"EDU14"},{"coefficient":-0.03559246,"_row":"EDU15"},{"coefficient":-0.03647639,"_row":"EDU16"},{"coefficient":-0.000043,"_row":"HOUR"},{"coefficient":0,"_row":"PREGTRUE"},{"coefficient":0,"_row":"EMPTRUE"},{"coefficient":-0.00013508,"_row":"SALARY"},{"coefficient":0.05262011,"_row":"LT5TRUE"},{"coefficient":-0.13170993,"_row":"LT10TRUE"},{"coefficient":0.15832131,"_row":"MT21TRUE"},{"coefficient":-0.00145601,"_row":"EMPTRUE:SALARY"},{"coefficient":0.00001024,"_row":"HOUR:SALARY"},{"coefficient":-0.00102195,"_row":"HOUR:EMPTRUE"},{"coefficient":0,"_row":"SEXTRUE:PREGTRUE"},{"coefficient":0.00049645,"_row":"AGE:SEXTRUE"},{"coefficient":0.00012678,"_row":"AGE:PREGTRUE"},{"coefficient":0,"_row":"AGE:BMI"},{"coefficient":-0.03261057,"_row":"AGE:LT5TRUE"},{"coefficient":0,"_row":"AGE:LT10TRUE"},{"coefficient":0.01151348,"_row":"EDU1:MT21TRUE"},{"coefficient":0,"_row":"EDU2:MT21TRUE"},{"coefficient":0,"_row":"EDU13:MT21TRUE"},{"coefficient":-0.01008402,"_row":"EDU14:MT21TRUE"},{"coefficient":-0.05530347,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.05739078,"_row":"EDU16:MT21TRUE"},{"coefficient":7.06478409e-06,"_row":"HOUR:EMPTRUE:SALARY"},{"coefficient":0,"_row":"AGE:SEXTRUE:PREGTRUE"}]');
}
function loadZeroreg(){
	return JSON.parse('[{"coefficient":-0.41092198,"_row":"intercept"},{"coefficient":-0.75548254,"_row":"BORNUSATRUE"},{"coefficient":-0.03193096,"_row":"AGE"},{"coefficient":0,"_row":"BMI"},{"coefficient":0.33328327,"_row":"SEXTRUE"},{"coefficient":0.25437068,"_row":"RACE2"},{"coefficient":0,"_row":"RACE3"},{"coefficient":0,"_row":"RACE4"},{"coefficient":0,"_row":"RACE6"},{"coefficient":0,"_row":"MARRY1"},{"coefficient":0,"_row":"MARRY2"},{"coefficient":0,"_row":"MARRY3"},{"coefficient":0,"_row":"MARRY4"},{"coefficient":0.32941676,"_row":"MARRY5"},{"coefficient":-0.28522605,"_row":"MARRY6"},{"coefficient":-1.04019353,"_row":"CANCERTRUE"},{"coefficient":-1.64165346,"_row":"DIABTRUE"},{"coefficient":0,"_row":"EDU1"},{"coefficient":0,"_row":"EDU2"},{"coefficient":0.45605815,"_row":"EDU13"},{"coefficient":0,"_row":"EDU14"},{"coefficient":0,"_row":"EDU15"},{"coefficient":-0.24480389,"_row":"EDU16"},{"coefficient":0.00458254,"_row":"HOUR"},{"coefficient":-1.59972372,"_row":"PREGTRUE"},{"coefficient":0.08761488,"_row":"EMPTRUE"},{"coefficient":-0.0054518,"_row":"SALARY"},{"coefficient":-0.46973815,"_row":"LT5TRUE"},{"coefficient":-0.23839389,"_row":"LT10TRUE"},{"coefficient":0.420364,"_row":"MT21TRUE"},{"coefficient":-0.00270058,"_row":"EMPTRUE:SALARY"},{"coefficient":0,"_row":"HOUR:SALARY"},{"coefficient":0.00037712,"_row":"HOUR:EMPTRUE"},{"coefficient":0,"_row":"SEXTRUE:PREGTRUE"},{"coefficient":0.00363748,"_row":"AGE:SEXTRUE"},{"coefficient":-0.00261318,"_row":"AGE:PREGTRUE"},{"coefficient":-0.00001216,"_row":"AGE:BMI"},{"coefficient":0,"_row":"AGE:LT5TRUE"},{"coefficient":0,"_row":"AGE:LT10TRUE"},{"coefficient":0.6399155,"_row":"EDU1:MT21TRUE"},{"coefficient":0.4900629,"_row":"EDU2:MT21TRUE"},{"coefficient":0,"_row":"EDU13:MT21TRUE"},{"coefficient":0,"_row":"EDU14:MT21TRUE"},{"coefficient":-0.36749299,"_row":"EDU15:MT21TRUE"},{"coefficient":-0.24395196,"_row":"EDU16:MT21TRUE"},{"coefficient":0,"_row":"HOUR:EMPTRUE:SALARY"},{"coefficient":0,"_row":"AGE:SEXTRUE:PREGTRUE"}]');
}
function predict(model, input) {
	var result = 0;
	console.log("predicting...")
	//loop through every model term
	for(i in model){
		var termresult = model[i]["coefficient"]

		for(var term of model[i]["_row"].split(":"))
		{
			//console.log(term)
			if(term.includes("TRUE")){
				//subtract out the level for boolean vars
				term = term.substr(0, term.length - "TRUE".length);
			}			
			val = parseFloat(input[term])
			//special case intercept
			if(term == "intercept"){
				val = 1;
			}
			if(isNaN(val)){
				if(input[term] == true){
					val = 1;
				}
			}
			if(isNaN(val)){
				//didn't find the term
				//check if the term is in the input, but followed by numeric levels
				for(iterm in input){
					if(term.includes(iterm))
					{
						//if we found a factored variable, we need to check
						//that the term matches the right level
						val = (input[iterm]) == parseInt(term.substr(iterm.length) || input[iterm] == true) ? 1 : 0
						break;
					}
				}
			}
			if(isNaN(val)){
				//This is ok if it's one of the unchecked condition checkboxes, default to 0
				console.log("Failed to find input term for " + term);
				val = 0;
			}
			termresult *= val
		}
		console.log(model[i]["_row"] + " value: " + termresult)
		result += termresult;
	}
	console.log("Result: " + result)
	return result
}

input = populateInput();
console.log(input)

reg = loadReg();
varreg = loadVarreg();
zeroreg = loadZeroreg();

pred = predict(reg, input)
varpred = Math.pow((Math.exp(predict(varreg, input)) - 1), 0.5)
zeropred =  1/(1+Math.exp(-predict(zeroreg, input)))

document.getElementById("pred").innerHTML = "Lognormal distribution mean: " + pred
document.getElementById("varpred").innerHTML = "Lognormal distribution standard deviation: " + varpred
document.getElementById("zeropred").innerHTML = Math.round(100.0 * zeropred) + "% of people like you spend $0 at the doctor"

//do some basic plotting
points = 100
iterations = 1000
var max = 10000
var c_last = 0
var c = 0
var last_j = Math.round(zeropred * iterations)
var aggregate = new Array(iterations)
for(var i=0;i<last_j;i++){
	aggregate[i] = 0;
}

agg_total = aggregate.length - Math.round(zeropred * iterations);
for(var i=0;i<agg_total;i++){
  val = i * max / points
  //convert to log space
  ls = Math.log(val + 1);
  c = cdf(ls, pred, varpred);
  tot = Math.round(agg_total * (c - c_last));
  c_last = c;
  for(var j=0; j<tot; j++){
  	aggregate[j + last_j] = val
  }
  last_j = tot + last_j
}
for(var i=last_j;i<aggregate.length;i++)
{
	//some amount of unused probability mass
	//for now just throw it into the max
	aggregate[i] = max;
}
console.log(aggregate)
var trace = {
  x: aggregate,
  type: 'histogram',
  xbins: {
    end: max, 
    size: (max + 1)/points, 
    start: 0
  }
};

var layout = {
  xaxis: {range: [0, max + 100]}
};


var data = [trace];

Plotly.newPlot('myDiv', data);


//http://extoxnet.orst.edu/faqs/dietcancer/web2/twohowto.html
(function() {
  'use strict';

  var moneyFormat = d3.format('$.1s');
  var moneyFormat2 = d3.format('$,');
  var commaFormat = d3.format(',');

  var chart = {
    margin: { top: 10, right: 30, bottom: 50, left: 50 },
    init: function() {
      var svg = this.svg = d3.select('#histogram').append('svg');
      this.g = svg.append('g');

      this.xAxis = this.g.append('g').attr('class', 'axis axis--x');
      this.yAxis = this.g.append('g').attr('class', 'axis axis--y');

      this.xAxisLabel = this.svg.append('text')
        .attr('x', '50%')
        .style('text-anchor', 'middle')
        .text('Cost');

      this.yAxisLabel = this.svg.append('text')
        .attr('x', 0)
        .style('text-anchor', 'start')
        // .text('People in simulation');

    },
    getDimensions: function() {
      var width = Math.floor( $('#histogram').width() ),
        height = Math.round(width/2);
      return [width, height];
    },
    update: function(trace) {
      var data;
      if (trace) {
        data = this.data = trace;
      } else {
        data = this.data;
      }
      var margin = this.margin,
        dimensions = this.getDimensions(),
        width = dimensions[0] - margin.left - margin.right,
        height = dimensions[1] - margin.top - margin.bottom,
        t = d3.transition().duration(250);

      this.svg.attr('width', dimensions[0])
        .attr('height', dimensions[1]);
      this.g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x =  d3.scaleLinear().rangeRound([0, width]).domain([0, data.xbins.end])

      var bins = d3.histogram()
        .domain( x.domain() )
        .thresholds( x.ticks(40) )(data.x); // 40 bins

      var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })]) // replace with [0, 5000] for static y-axis
        .range([height, 0]);

      // update bars
      var bar = this.g.selectAll('.bar')
        .data(bins);

      bar.enter()
        .append('rect')
        .attr('class', 'bar')
        .on('mousemove', function(d, i) {
          var phrase = commaFormat(bins[i].length) + ' people paid between ' + moneyFormat2(bins[i].x0) + ' and ' + moneyFormat2(bins[i].x1);
          document.getElementById('info').innerHTML = phrase;
        })
        .on('mouseout', function() {
          document.getElementById('info').innerHTML = '&nbsp;';
        })
        .merge(bar)
          .attr('x', function(d) { return x(d.x0); })
          .attr('width', x( bins[0].x1 ) - x( bins[0].x0 ) - 1)
          .transition(t)
            .attr('y', function(d) { return y(d.length); })
            .attr('height', function(d) { return height - y(d.length); });

      bar.exit()
        .transition(t)
        .attr('y', y(0))
        .remove();

      // update axis
      this.xAxis
        .transition(t)
        .attr('transform', 'translate(0,' + height + ')')
        .call( d3.axisBottom(x).tickFormat( moneyFormat ) );

      this.yAxis
        .transition(t)
        .call( d3.axisLeft(y) );

      this.xAxisLabel.attr('y', dimensions[1] - 10);
      this.yAxisLabel.attr('y', dimensions[1]/2)

    },
    resize: function() {
      console.log('resize')
      this.update();
    }
  };
    

  $(document).ready(function() {

    // draw from a standard normal distribution (mean = 0, sd = 1)
    // see http:// stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    function drawStandardNormal() {
      var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
      var v = 1 - Math.random();
      return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    // helper function to draw from a non-standard 
    // gaussian distribution with a given mean and sd
    function drawNormal(mean, sd) {
      return drawStandardNormal() * sd + mean;
    }

    // another silly helper function- fills out the 
    // input dictionary with values
    function populateInput(){
      var input = {};

      var inputs = document.getElementsByClassName('ms-input');
      for (var i=0; i < inputs.length; i++) {
        if (inputs[i].type == 'radio'){
          if (inputs[i].checked){
            input[inputs[i].name] = inputs[i].value;  
          }
        } else if (inputs[i].type == 'checkbox'){
          if (inputs[i].checked) {
            input[inputs[i].value] = 1;  
          } else {
            input[inputs[i].value] = 0;
          }     
        } else {
          input[inputs[i].name] = inputs[i].value;
        }
      }

      // Note these values must match the column names in the R model
      // e.g. there is a RACE column in the R model, and we must name that 
      // term 'RACE' in our input

      // Note also the levels must match- e.g. if R has levels 1, 2, 3, 14, 15, 16, 
      // those are the values
      // we must use in our select inputs as well

      //we're dividing by height, so make sure it's not zero
      input['HEIGHT'] = Math.max(parseInt(input['HEIGHTFT'] * 12) + parseInt(input['HEIGHTIN']), 1)

      // calculate BMI from height and weight 
      // see http:// www.thecalculatorsite.com/articles/health/bmi-formula-for-bmi-calculations.php
      var BMI = 703 * input['WEIGHT'] / Math.pow(input['HEIGHT'], 2);
      //convert to levels
      if(BMI < 18.5){
        input['BMI'] = 1;
      } else if (BMI < 25){
        input['BMI'] = 2;
      } else if (BMI < 30){
        input['BMI'] = 3;
      } else if (BMI < 40){
        input['BMI'] = 4;
      } else {
        input['BMI'] = 5;
      }

      // Transform salary to log space as we do in the R model
      input['SALARY'] = Math.log(input['SALARY'] + 1);

      // Create dummy variable to introduce nonlieearity for childhood development
      input['LT5']=(input['AGE'] < 5) ;
      input['LT10']=(input['AGE'] < 10);
      input['MT21']=(input['AGE'] > 21);

      // derive employment status from other inputs
      input['EMP']=(input['SALARY'] > 0 && input['HOUR'] > 0);

      // It's weird to encode MALE as TRUE, so we just transform it here instead
      input['SEX']= (input['SEX'] == 'male') ? 1 : 0;

      return input;
    }

    // loops through model parameters as output by the R toJSON package and look for matching params
    // in the input dictionary.  Once you find matching values, multiply the coefficient by the
    // value to come up with our model prediction

    // this is equivalent to predict(model, newdate=input) in R
    function predict(model, input) {
      var result = 0;

      // loop through every model term
      for(var i in model){
        var termresult = model[i]['coefficient'];

        // For interaction terms, we need to find the term for each piece and multiply them together
        for(var term of model[i]['_row'].split(':')) {
          if(term.includes('TRUE')){
            // subtract out the level for boolean vars
            // e.g. BORNUSATRUE -> BORNUSA
            term = term.substr(0, term.length - 'TRUE'.length);
          }     
          var val = parseFloat(input[term])
          // special case intercept, which always applies 
          if(term == 'intercept'){
            val = 1;
          }
          if(isNaN(val)){
            // if we failed to parseInt() on input term, the 
            // term may just be a boolean, which
            // doesn't coerce to 1 in parseInt
            if(input[term] == true){
              val = 1;
            }
          }
          if(isNaN(val)){
            // if we didn't find the term, loop through the 
            // input for a term that is the same,
            // but followed by a numeric level. e.g. RACE is 
            // encoded in R as separate columns
            // with RACE1 = false, RACE2 = false, RACE3 = true, etc.  
            for(var iterm in input) {
              if(term.includes(iterm)) {
                // if we found a factored variable, we need 
                // to check that the term matches
                // the correct level.  If not, the input term 
                // doesn't match the specified
                // level in R, and we set val to zero
                val = (input[iterm]) == parseInt(term.substr(iterm.length) || input[iterm] == true) ? 1 : 0
                break;
              }
            }
          }
          if(isNaN(val)){
            //This is an error case we should never hit
            console.log('Failed to find input term for ' + term);
            val = 0;
          }
          termresult *= val;
        }
        result += termresult;
      }
      return result;
    }

    // function simulates a given number of iterations
    function simulate(pred, varpred, zeropred, iterations){
      var sim = new Array(iterations);
      for(var i=0; i < iterations; i++) {
        // account for inflation of 3% a year from 2014 data to 2017
        sim[i] = ( Math.exp( drawNormal(pred, varpred) ) - 1 ) * Math.pow(1.03, 3);
        if (Math.random() < zeropred) {
          sim[i] = 0;
        }
      }
      return sim;
    }

    function run() { 
      var iterations = 5000;
      var input = populateInput();
      var pred = predict(REG, input);
      
      // we actually predict the log of variance in log space, and what we want 
      // is the standard deviation in log space, so we have to transform it
      var varpred = Math.pow((Math.exp(predict(VARREG, input)) - 1), 0.5)

      // Logistic regression means we transform with the logit function
      var zeropred =  1/(1 + Math.exp(-predict(ZEROREG, input)));

      // run the simulation 5000 times!!!  
      // Sort the output to make median calculation easy later
      var sim = simulate(pred, varpred, zeropred, iterations).sort(function (a,b) {
        return a - b;
      });

      // calculate mean, median, etc. since javascript is less cool than R
      var max = 10000,
        z = 0,
        total = 0,
        m = 0;

      for(var i=0; i < sim.length; i++){
        total += sim[i]
        if(sim[i] == 0){
          z++;
        }
        if(sim[i] > max){
          m++;
        }
      }

      // output the model results
      // document.getElementById('pred').innerHTML = 'Lognormal distribution mean: ' + pred;
      // document.getElementById('varpred').innerHTML = 'Lognormal distribution standard deviation: ' + varpred;
      document.getElementById('iterations').innerHTML = commaFormat(iterations);
      document.getElementById('mean').innerHTML = moneyFormat2(Math.round(total/sim.length));
      document.getElementById('median').innerHTML =  moneyFormat2(Math.round(sim[Math.round(sim.length / 2)]));
      document.getElementById('zeropercent').innerHTML = commaFormat(Math.round(100*z/iterations));
      //document.getElementById('maxval').innerHTML = moneyFormat2(max);
      //document.getElementById('maxpercent').innerHTML = commaFormat(Math.round(100*m/iterations));
      document.getElementById('toptwopercent').innerHTML = moneyFormat2(Math.round(sim[Math.round(iterations * 0.98)]));

      // do some basic plotting
      var buckets = 40;
      var trace = {
        x: sim,
        xbins: {
          start: sim[0],
          end: max, 
          size: (max + 1)/buckets
        }
      };
      chart.update(trace);
    }


    // add event listeners for all the input elements
    var inputs = document.getElementsByClassName('ms-input');
    for (var i=0; i < inputs.length; i++) {
      if (inputs[i].type == 'range') {
        // not sure why data-attr isn't working for SALARY, 
        // I need to investigate this later.
        var from = inputs[i].name == 'SALARY' ? '50000' : inputs[i].value; 
        $(inputs[i]).ionRangeSlider({
          from: from,
          onFinish: function (data) {
            data.input.context.value = data.from;
            run();
          },
        });
      } else {
        inputs[i].addEventListener('change', run);   
      }
    }

    // init chart
    chart.init();

    $(window).on('resize', function() {
      chart.resize();
    });

    // run once on load
    run();
  });
})();
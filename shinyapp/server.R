#setwd("~/github/medical-cost/shinyapp")
load("medical_cost_reg.rda")
load("medical_cost_var.rda")
load("medical_cost_zero.rda")
load("factor_col_names.rda")
load("levels.rda")
load("formula.rda")
library(scales)
library(Matrix)
library(gamlr)

smax <- 10000

sparsify <- function(tinput, factor_dict){
  for(col in factor_col_names) {
    {
      tinput[,col] <- factor(tinput[,col], levels=factor_dict[col][[1]])
    }
  }
  return(sparse.model.matrix(
    custom_formula, 
    data=tinput)[,-1]
    )
  
}
simulate_costs <- function(input, iterations){
  tinput <- data.frame(BORNUSA=input$BORNUSA, AGE=input$AGE, BMI=abs(input$BMI - 26),
                       SEX=input$SEX, RACE=input$RACE, MARRY=input$MARRY, 
                       CANCER=("CANCER" %in% input$conditions), DIAB=("DIAB" %in% input$conditions), EDU=input$EDU, 
                       HOUR=input$HOUR, HASWG=(input$SALARY > 0), PREG=("PREG" %in% input$conditions), 
                       EMP=input$SALARY > 0, SALARY=log(input$SALARY + 1), 
                       LT5=(input$AGE < 5), LT10=(input$AGE < 10))
  
  tinput <- sparsify(tinput, custom_levels) 
  zinput <- Matrix(tinput, nrow=1)
  
  pred <- predict(reg, select="1se", newdata=zinput)[1]
  predsd <- (exp(predict(varreg, select="1se", newdata=zinput)[1]) - 1)^0.5
  rand <- rnorm(n=iterations, mean=pred, 
                sd=predsd)
  predz <-predict(zeroreg, newdata=zinput, select="1se", type="link")[1]
  zlimit <- 1/(1+exp(-predz))
  
  zrand <- runif(n=iterations, min=0, max=1) > zlimit
  print(paste("Predicted value:", pred, "; SD:", predsd, "; Zero Odds:", zlimit))
  return(zrand * rand)
}
# Define server logic required to draw a histogram
server <- function(input, output) {
  # Expression that generates the plot The expression is
  # wrapped in a call to renderPlot to indicate that:
  #
  #  1) It is "reactive" and therefore should be automatically
  #     re-executed when inputs change
  #  2) Its output type is a plot
  simreact <- reactive({
    #set.seed(0)
    #account for inflation rate of 3% from 2014 - 2017
    sim <<- (exp(simulate_costs(input, 1000)) - 1) * (1.03)^3
  })
  output$explanationText <- renderText({

    paste("<button data-toggle='collapse' data-target='#description' class='btn-primary'>So what is this thing exactly?</button>",
          "<div id='description' class='collapse'>",
          "<p>This tool uses the <a href='https://meps.ahrq.gov/mepsweb/data_stats/download_data_files_detail.jsp?cboPufNumber=HC-171'>",
          "Medical Expenditure Panel Survey</a> data to ", 
          "simulate the distribution of total healthcare expenses ",
          "you can expect to incur over the next year.  Your final out-of-pocket ",
          "expense depends on the type of insurance you have, and what percentage ",
          "of your costs it covers.  For reference, a 'Silver' plan under the ACA ",
          "is one that is expected to cover about 70% of costs on average.",
          "<p></p>",
          "Healthcare spend is bimodal in log space, with one peak at $0 and the other ",
          "a function of demographic data. This tool uses a logistic regression to ",
          "predict the odds of spending $0, and a regularized linear regression to ",
          "predict the mean and standard deviation of the log of non-zero healthcare costs. ",
          "You can find the code and data for this tool ",
          "<a href='https://github.com/jakewalker56/medical-cost'>here</a>.</p>",
  
          "</div>",
          sep="")
  })
  output$distPlot <- renderPlot({
    #x    <- faithful[, 2]  # Old Faithful Geyser data
    #profile <- data.frame()
    #prifile$age <- input$age
    #bins <- seq(min(x), max(x), length.out = input$bins + 1)

    # draw the histogram with the specified number of bins
    #hist(x, breaks = bins, col = 'darkgray', border = 'white')
    
    #d <- density(sim)
    #bins <- c(-100, 100, seq(min(sim[sim > 0]), max(sim), length.out = 20))
    sim<- simreact()
    bins <- seq(0, smax, length.out = 40)
    #d <- hist(sim[sim > 0 & sim < smax], breaks = bins)
    d <- hist(sim[sim < smax], breaks = bins)
    #d <- density(sim[sim > 0 & sim < smax])
    plot(d, main="Simulation of 1,000 people like you", xlab="total cost")
    #polygon(d, col="red", border="blue")
  })
  output$zeroPercentageText <- renderText({
    c="green"
    sim <- simreact()
    paste("<b style='color:", c, "'>", 100 * round(length(sim[sim <= 0]) / length(sim), 3), "%</b> of people like you don't go to the doctor at all (incur $0 in healthcare costs)", sep="")
  })
  output$maxPercentageText <- renderText({
    c="red"
    sim <- simreact()
    paste("<b style='color:", c, "'>", round(100 * length(sim[sim > smax]) / length(sim), 3), "%</b> of people like you use over ", dollar_format()(round(smax,0)), " of healthcare", sep="")
  })
  output$meanText <- renderText({
    c="orange"
    sim <- simreact()
    paste("The <b style='color:", c, "'>mean</b> annual healthcare spend by people like you is <b style='color:", c, "'>", dollar_format()(round(mean(sim),0)), "</b>")
  })
  output$meanPlot <- renderPlot({
    c = "orange"
    sim <- simreact()
    xlim <- c(0,smax);
    ylim <- c(-1,1);
    xloc <- mean(sim)
    par(xaxs='i',yaxs='i',mar=c(1,5,1,3));
    plot(NA,xlim=xlim,ylim=ylim,axes=F,ann=F);
    axis(1, at=c(0, smax), pos=0);

    segments(xloc,0.5,xloc,-0.5, col=c, lwd = 3);
    points(xloc,0,pch=19,xpd=NA, col=c, lwd = 2);
  })
  output$medianText <- renderText({
    c = "blue"
    sim <- simreact()
    paste("The <b style='color:", c, "'>median</b> annual healthcare spend by people like you is <b style='color:", c, "'>", dollar_format()(round(median(sim),0)), "</b>")
  })
  output$medianPlot <- renderPlot({
    c = "blue"
    sim <- simreact()
    xlim <- c(0,smax);
    ylim <- c(-1,1);
    xloc <- median(sim)
    par(xaxs='i',yaxs='i',mar=c(1,5,1,3));
    plot(NA,xlim=xlim,ylim=ylim,axes=F,ann=F);
    axis(1, at=c(0, smax), pos=0);
    
    segments(xloc,0.5,xloc,-0.5, col=c, lwd = 3);
    points(xloc,0,pch=19,xpd=NA, col=c, lwd = 2);
    ?points
  })
}


library(shiny)
library(gamlr)
library(Matrix)
setwd("~/github/medical-cost/shinyapp")
source("server.R")
source("ui.R")
shinyApp(ui=ui, server=server)

#ui <- fluidPage()
#server <- function(input, output){}


#library(shiny)
#runExample("01_hello")


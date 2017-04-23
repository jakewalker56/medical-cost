# Define UI for application that draws a histogram
ui <- fluidPage(
  # Application title
  titlePanel("How much will I spend on healthcare this year?"),
  
  # Sidebar with a slider input for the number of bins
  sidebarLayout(
    sidebarPanel(
      sliderInput("AGE",
                  "Age:",
                  min = 1,
                  max = 85,
                  value = 30),
      sliderInput("BMI",
                  "BMI:",
                  min = 12,
                  max = 40,
                  value = 26),
      sliderInput("HOUR",
                  "Hours worked per week",
                  min = 0,
                  max = 80,
                  value = 40),
      sliderInput("SALARY",
                  "Annual Salary",
                  min = 0,
                  max = 300000,
                  value = 75000),
      radioButtons("SEX",
                   "Gender",
                   c(
                     "Male"=TRUE,
                     "Female"=FALSE
                   )),
      checkboxInput("BORNUSA",
                  "Born in the USA?",
                  value = TRUE),
      selectInput("RACE",
                  "Race",
                  c("White" = "1",
                    "Black" = "2",
                    "American Indian/Alaskan" = "3",
                    "Asian/Pacific Islander" = "4",
                    "Multiple Races" = "6")),
      selectInput("MARRY",
                  "Marital Status",
                  c(
                    "Married" = "1",
                    "Widowed" = "2",
                    "Divorced" = "3",
                    "Separated" = "4",
                    "Never Married" = "5",
                    "Under 16/Inapplicable" = "6"
                  )),
    selectInput("EDU",
                  "Education Level",
                  c(
                    "Inapplicable or under 5 years old" = "-1",
                    "Less than 8th grade"="1",
                    "9-12th grade, no HS Diploma"="2",
                    "GED or HS Grad"="13",
                    "Some College or Associate Degree" = "14",
                    "Bachelor's degree"="15",
                    "Masters, Doctorate, or Professional Degree" ="16"
                  ),
                  selected="15"),
    checkboxGroupInput("conditions",
                       "Do any of these conditions apply to you, or do you have reason to believe they will apply to you in the next year?",
                       c(
                         "Cancer" = "CANCER",
                         "Diabetes" = "DIAB",
                         "Pregnant" = "PREG"
                       )
                  )
    ),
    # Show a plot of the generated distribution
    mainPanel(
      htmlOutput("explanationText"),
      plotOutput("distPlot"),
      htmlOutput("zeroPercentageText"),
      htmlOutput("maxPercentageText"),
      htmlOutput("meanText"),
      plotOutput("meanPlot", height="60px"),
      htmlOutput("medianText"),
      plotOutput("medianPlot", height="60px")
    )
  )
)

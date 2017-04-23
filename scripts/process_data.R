setwd("~/github/medical_cost/data")
data = read.csv("raw_data.csv")

#drop any row without an age, because... huh?
data <- data[data$AGE >= 0,]

#drop rows that don't have weight
data <- data[data$PERWT > 0,]

data$BORNUSA <- data$BORNUSA == 1

#Aggregate multiple wage values into one field
data$HRWG31[data$HRWG31 == -10] <- 80
data$HRWG42[data$HRWG42 == -10] <- 80
data$HRWG53[data$HRWG53 == -10] <- 80
data$HRWG31[data$HRWG31 < 0] <- -1
data$HRWG42[data$HRWG42 < 0] <- -1
data$HRWG53[data$HRWG53 < 0] <- -1
data$HRWG <- pmax(data$HRWG31, data$HRWG42, data$HRWG53)
data <- data[ , !(names(data) %in% c("HRWG31","HRWG42","HRWG53"))]

#Aggregate multiple hours worked values into one field
data$HOUR31[data$HOUR31 < 0] <- 0
data$HOUR42[data$HOUR42 < 0] <- 0
data$HOUR53[data$HOUR53 < 0] <- 0
data$HOUR <- pmax(data$HOUR31, data$HOUR42, data$HOUR53)
#these people are lying or confused
data$HOUR <- pmin(data$HOUR, 80)
data$HASWG <- data$HRWG > 0
data <- data[ , !(names(data) %in% c("HOUR31","HOUR42","HOUR53"))]

#Aggregate multiple preg values into one field
data$PREG31 <- data$PREG31 == 1
data$PREG42 <- data$PREG42 == 1
data$PREG53 <- data$PREG53 == 1
data$PREG <- pmax(data$PREG31, data$PREG42, data$PREG53)
data <- data[ , !(names(data) %in% c("PREG31","PREG42","PREG53"))]
data$PREG <- data$PREG == 1

data$SEX <- data$SEX == 1

#Aggregate employment values into one field
data$EMP31 <- data$EMP31 %in% c(1, 2, 3)
data$EMP42 <- data$EMP42 %in% c(1, 2, 3)
data$EMP53 <- data$EMP53 %in% c(1, 2, 3)
data$EMP <- pmax(data$EMP31, data$EMP42, data$EMP53)
data <- data[ , !(names(data) %in% c("EMP31","EMP42","EMP53"))]
data$EMP <- data$EMP == 1

#set BMI to national average if no data
data$BMI[data$BMI < 0] <- 26.5

#combine all unknown EDU values
data$EDU[data$EDU < 0] <- -1

data$SALARY <- data$HRWG * data$HOUR * data$HASWG * 52
hist(data$SALARY[data$SALARY > 0])

data$MARRY[data$MARRY < 0] <- -1

data$DIAB <- data$DIAB == 1
data$CANCER <- data$CANCER == 1
summary(data)


write.csv(data, file = "processed_data.csv", row.names = FALSE)

library(gamlr)
library(jsonlite)
set.seed(0)

setwd("~/github/medical-cost/data")
data = read.csv("processed_data.csv")

#Since we're predicitng costs, we should only count people as having 
#diabetes if they new about it going into the year
data$DIAB <- data$DIAB & (data$AGE - data$DIABAGE > 1)
#We should do this with Cancer as well, but looks like CANCERAGE isn't tracked in
#the dataset

#convert categorical variables to factors
data$BORNUSA <- factor(data$BORNUSA)
data$EMP <- factor(data$EMP)
data$PREG <- factor(data$PREG)
data$EDU <- factor(data$EDU)
data$DIAB <- factor(data$DIAB)
data$CANCER <- factor(data$CANCER)
data$MARRY <- factor(data$MARRY)
data$RACE <- factor(data$RACE)
data$SEX <- factor(data$SEX)
data$LT5 <- factor(data$AGE < 5)
data$LT10 <- factor(data$AGE < 10)
data$MT21 <- factor(data$AGE > 21)
factor_col_names <- c("BORNUSA", "SEX", "RACE", "MARRY", "CANCER", "DIAB", "EDU", "PREG","EMP", "LT5", "LT10", "MT21")

#Normalize BMI to midpoint of "healthy"
data$BMI <- abs(data$BMI - 22)
data$BMI2 <- (data$BMI)^2

custom_levels = list(
  BORNUSA=levels(data$BORNUSA),
  EMP=levels(data$EMP),
  PREG=levels(data$PREG),
  EDU=levels(data$EDU),
  DIAB=levels(data$DIAB),
  CANCER=levels(data$CANCER),
  MARRY=levels(data$MARRY),
  RACE=levels(data$RACE),
  SEX=levels(data$SEX),
  LT5=levels(data$LT5),
  LT10=levels(data$LT10),
  MT21=levels(data$MT21)
  )

data$SALARY <- log(data$SALARY + 1)

nonzero_data <- data[data$TOTEXP > 0,]
zero_data <- data
zero_data$is_zero <- zero_data$TOTEXP <= 0
zero_data <- zero_data[,-grep("TOTEXP", colnames(zero_data))]

custom_formula <- as.formula("~ . + SALARY*EMP*HOUR*RACE + MT21*AGE*DIAB*CANCER + AGE*PREG*(BMI+BMI2) + (LT5+LT10+MT21)*AGE*SEX*(BMI+BMI2) + EDU*MT21*RACE")
yval <- log(nonzero_data$TOTEXP + 1)
xval <- nonzero_data[,-grep(c("TOTEXP|DUID|PID|HRWG|PERWT|HASWG|DIABAGE"),colnames(nonzero_data))]
xval <- sparse.model.matrix(
   custom_formula, 
  data=xval)[,-1]
reg <- cv.gamlr(x=xval, y=yval, family="gaussian", lmr=1e-05, standardize=TRUE, obsweights=nonzero_data$PERWT)
summary(reg)
coef(reg, select="min")
hist((predict(reg, newdata=xval, select="min"))[,1])
hist(yval)

#model the variance around the prediction
var <- log((yval - (predict(reg, newdata=xval, select="1se"))[,1])^2 + 1)
varreg <- cv.gamlr(x=xval, y=var, family="gaussian", lmr=1e-05, standardize=TRUE, obsweights=nonzero_data$PERWT)
coef(varreg, select="min")

#model occurence of zero cost
zeroy <- zero_data$is_zero
zerox <- zero_data[,-grep(c("is_zero|DUID|PID|HRWG|PERWT|HASWG|DIABAGE"),colnames(zero_data))]
zerox <- sparse.model.matrix(
  custom_formula, 
  data=zerox)[,-1]
zeroreg <- cv.gamlr(x=zerox, y=zeroy, lmr=1e-05, family="binomial", standardize=TRUE, obsweights=zero_data$PERWT)
coef(zeroreg, select="min")
#show predicted rate of zero across all users
hist(1/(1+exp(-predict(zeroreg, newdata=zerox, select="1se", type="link")))[,1])

save(reg, file = "../shinyapp/medical_cost_reg.rda")
save(varreg, file = "../shinyapp/medical_cost_var.rda")
save(zeroreg, file = "../shinyapp/medical_cost_zero.rda")
save(custom_levels, file = "../shinyapp/levels.rda")
save(factor_col_names, file = "../shinyapp/factor_col_names.rda")
save(custom_formula, file ="../shinyapp/formula.rda")

regdf <- as.data.frame(as.matrix(coef(reg, select="min")))
colnames(regdf) <- c("coefficient")
regdf <- regdf[regdf$coefficient !=0,,drop=FALSE]
write(toJSON(regdf, digits=8), "reg.json")

varregdf <- as.data.frame(as.matrix(coef(varreg, select="min")))
colnames(varregdf) <- c("coefficient")
varregdf <- varregdf[varregdf$coefficient !=0,,drop=FALSE]
write(toJSON(varregdf, digits=8), "verreg.json")

zeroregdf <- as.data.frame(as.matrix(coef(zeroreg, select="1se")))
colnames(zeroregdf) <- c("coefficient")
zeroregdf <- zeroregdf[zeroregdf$coefficient !=0,,drop=FALSE]
write(toJSON(zeroregdf, digits=8), "zeroreg.json")

test <- data.frame(BORNUSA=TRUE, AGE=30, BMI=3,
                   SEX=TRUE, RACE="1", MARRY="1", 
                   CANCER=FALSE, DIAB=FALSE, EDU="15", 
                   HOUR=40, PREG=FALSE, 
                   EMP=TRUE, SALARY=13.527829818844937,
                   LT5=FALSE, LT10=FALSE, MT21=TRUE, BMI2=9)
for(col in factor_col_names) {
  {
    test[,col] <- factor(test[,col], levels=custom_levels[col][[1]])
  }
}
test[2,] <- test[1,]
testmat <- sparse.model.matrix(
  custom_formula, 
  data=test)[,-1]

colnames(testmat)
coef(reg)
predict(reg, newdata=matrix(testmat[1,],nrow=1), select="min")


testval <- nonzero_data[,-grep(c("TOTEXP|DUID|PID|HRWG|PERWT|HASWG|DIABAGE"),colnames(nonzero_data))]
testval <- sparse.model.matrix(
  custom_formula, 
  data=testval[testval$CANCER==TRUE,])[,-1]

hist(predict(reg, newdata=testval, select="min")[,1])
hist(log(data[data$CANCER == TRUE, "TOTEXP"] + 1))

1/(1+exp(-predict(zeroreg, newdata=matrix(testmat[1,],nrow=1), select="1se", type="link")))[,1]

summary(reg)
coef(reg, select="min")

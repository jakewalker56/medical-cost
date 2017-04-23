library(gamlr)
set.seed(0)

setwd("~/github/medical_cost/data")
data = read.csv("processed_data.csv")

#Since we're predicitng costs, we should only count people as having 
#diabetes if they new about it going into the year
data$DIAB <- data$DIAB & (data$AGE - data$DIABAGE > 1)
#We should do this with Cancer as well, but looks like CANCERAGE isn't tracked in
#the dataset

#convert categorical variables to factors
data$BORNUSA <- factor(data$BORNUSA)
data$EMP <- factor(data$EMP)
data$HASWG <- factor(data$HASWG)
data$PREG <- factor(data$PREG)
data$EDU <- factor(data$EDU)
data$DIAB <- factor(data$DIAB)
data$CANCER <- factor(data$CANCER)
data$MARRY <- factor(data$MARRY)
data$RACE <- factor(data$RACE)
data$SEX <- factor(data$SEX)
data$LT5 <- factor(data$AGE < 5)
data$LT10 <- factor(data$AGE < 10)
factor_col_names <- c("BORNUSA", "SEX", "RACE", "MARRY", "CANCER", "DIAB", "EDU", "PREG","EMP", "LT5", "LT10")

#Normalize BMI to average
data$BMI <- abs(data$BMI - 26)

custom_levels = list(
  BORNUSA=levels(data$BORNUSA),
  EMP=levels(data$EMP),
  HASWG=levels(data$HASWG),
  PREG=levels(data$PREG),
  EDU=levels(data$EDU),
  DIAB=levels(data$DIAB),
  CANCER=levels(data$CANCER),
  MARRY=levels(data$MARRY),
  RACE=levels(data$RACE),
  SEX=levels(data$SEX),
  LT5=levels(data$LT5),
  LT10=levels(data$LT10)
  )

data$SALARY <- log(data$SALARY + 1)

nonzero_data <- data[data$TOTEXP > 0,]
zero_data <- data
zero_data$is_zero <- zero_data$TOTEXP <= 0
zero_data <- zero_data[,-grep("TOTEXP", colnames(zero_data))]

custom_formula <- as.formula("~ . + HASWG*SALARY*EMP*HOUR + SEX*PREG*AGE + BMI*AGE + (LT5+LT10)*AGE")
yval <- log(nonzero_data$TOTEXP + 1)
xval <- nonzero_data[,-grep(c("TOTEXP|DUID|PID|HRWG|PERWT|DIABAGE"),colnames(nonzero_data))]
xval <- sparse.model.matrix(
   custom_formula, 
  data=xval)[,-1]
reg <- cv.gamlr(x=xval, y=yval, family="gaussian", lmr=1e-05, weights=data$PERWT)
summary(reg)
coef(reg, select="min")

hist((predict(reg, newdata=xval, select="min"))[,1])
hist(yval)

#model the variance around the prediction
var <- log((yval - (predict(reg, newdata=xval, select="1se"))[,1])^2 + 1)
varreg <- cv.gamlr(x=xval, y=var, family="gaussian", lmr=1e-05, weights=data$PERWT)
coef(varreg, select="min")
#show predicted variance in log space
hist((exp(predict(varreg, select="min", newdata=xval)[,1]) - 1))

#model occurence of zero cost
zeroy <- zero_data$is_zero
zerox <- zero_data[,-grep(c("is_zero|DUID|PID|HRWG|PERWT|DIABAGE"),colnames(zero_data))]
zerox <- sparse.model.matrix(
  custom_formula, 
  data=zerox, contrasts.arg = custom_contrasts)[,-1]
zeroreg <- cv.gamlr(x=zerox, y=zeroy, lmr=1e-05, family="binomial")
coef(zeroreg, select="min")
#show predicted rate of zero across all users
hist(1/(1+exp(-predict(zeroreg, newdata=zerox, select="1se", type="link")))[,1])

save(reg, file = "../shinyapp/medical_cost_reg.rda")
save(varreg, file = "../shinyapp/medical_cost_var.rda")
save(zeroreg, file = "../shinyapp/medical_cost_zero.rda")
save(custom_levels, file = "../shinyapp/levels.rda")
save(factor_col_names, file = "../shinyapp/factor_col_names.rda")
save(custom_formula, file ="../shinyapp/formula.rda")

test <- data.frame(BORNUSA=TRUE, AGE=30, BMI=21,
                   SEX=TRUE, RACE="1", MARRY="1", 
                   CANCER=FALSE, DIAB=FALSE, EDU="-1", 
                   HOUR=40, HASWG=(1 > 0), PREG=FALSE, 
                   EMP=(1 > 0), SALARY=log(1+ 1),
                   LT5=FALSE, LT10=FALSE)
for(col in factor_col_names) {
  {
    test[,col] <- factor(test[,col], levels=custom_levels[col][[1]])
  }
}
test
testmat <- sparse.model.matrix(
  custom_formula, 
  data=test)[,-1]

predict(reg, newdata=matrix(testmat,nrow=1), select="min")[1]
1/(1+exp(-predict(zeroreg, newdata=matrix(testmat,nrow=1), select="1se", type="link")))[,1]

coef(zeroreg, select="1se")

# medical-cost

This tool uses the Medical Expenditure Panel Survey data to simulate the distribution of total healthcare expenses you can expect to incur over the next year. Your final out-of-pocket expense depends on the type of insurance you have, and what percentage of your costs it covers. For reference, a 'Silver' plan under the ACA is one that is expected to cover about 70% of costs on average.

Healthcare spend is bimodal in log space, with one peak at $0 and the other a function of demographic data. This tool uses a logistic regression to predict the odds of spending $0, and a regularized linear regression to predict the mean and standard deviation of the log of non-zero healthcare costs. 

To generate the csv processed csv files, download the h171.dat file from the [MEPS website](https://meps.ahrq.gov/mepsweb/data_stats/download_data_files_detail.jsp?cboPufNumber=HC-171), then run the command:

python extract_csv.py -file h171.dat -schema 171_schema.ini

This should generate the raw_output.csv.  You can then run the process_data.R script to generate the processed_data.csv file


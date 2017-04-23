import ConfigParser
import numpy as np
import pandas as pd
import argparse
import os.path


#get args
parser = argparse.ArgumentParser(description='Convert ascii .dat files into structured CSV files using a schema config file.')
parser.add_argument('file', action="store")
parser.add_argument('-schema', "-s", action="store", dest="schema", default="schema.ini")
parser.add_argument('-limit', "-l", action="store", dest="limit", type=int)
args = parser.parse_args()


print "converting " + args.file + " to " + args.file[:-3] + "csv using " + args.schema

if os.path.isfile(args.schema) is False:
  print "ERROR: file " + args.schema + " does not exist"
  quit()

if os.path.isfile(args.file) is False:
  print "ERROR: file " + args.file + " does not exist"
  quit()

#load config file
Config = ConfigParser.ConfigParser()
Config.read(args.schema)
VarDict = {}
for var in Config.sections():
  options = Config.options(var)
  VarDict[var] = [int(Config.get(var, "start")), int(Config.get(var, "end"))]

for key in VarDict.keys():
  print key
  print VarDict[key][0]
  print VarDict[key][1]

#load data file
df = pd.DataFrame(columns = VarDict.keys())
print df

row = 0
with open(args.file) as f:
  for line in f:
    df.loc[row] = None
    for key in VarDict.keys():
      df.loc[row][key] = line[VarDict[key][0] - 1 :VarDict[key][1]] 
    row += 1
    if row == 10: 
      print "sample data:"
      print df 
    if args.limit is not None and row > args.limit:
      break
    if row % 1000 == 0:
      print "Extracted row " + str(row) 
#args.file[:-3]
df.to_csv("raw_data.csv", index=False)
print "done!"

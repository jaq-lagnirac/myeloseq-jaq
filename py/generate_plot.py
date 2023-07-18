# Justin Caringal
# Takes source TSV table and generates plots
# set/source of coverage

import os
import sys
import argparse
import logging
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

SEP = '\t'
FILE_SEP = '.'

EXIT = 'Exiting program.'
ROUNDING_DECIMALS = 3

BIN_WIDTH = 0.5
ALPHA = 0.3
HISTTYPE = 'barstacked'
STACKED = True
DENSITY = True



SCRIPT_PATH = os.path.abspath(__file__)
FORMAT = '[%(asctime)s] %(levelname)s %(message)s'
l = logging.getLogger()
lh = logging.StreamHandler()
lh.setFormatter(logging.Formatter(FORMAT))
l.addHandler(lh)
l.setLevel(logging.INFO)
debug = l.debug; info = l.info; warning = l.warning; error = l.error

DESCRIPTION = '''

Takes source TSV table and generates plots

'''

EPILOG = '''

Outputs statistics in .err file.

'''

class CustomFormatter(argparse.ArgumentDefaultsHelpFormatter,
    argparse.RawDescriptionHelpFormatter):
  pass
parser = argparse.ArgumentParser(description=DESCRIPTION, epilog=EPILOG,
  formatter_class=CustomFormatter)

parser.add_argument('coverage_table',
                    help='Source TSV table')
parser.add_argument('-v', '--verbose',
                    action='store_true',
                    help='Set logging level to DEBUG')

args = parser.parse_args()

if args.verbose:
  l.setLevel(logging.DEBUG)



debug('%s begin', SCRIPT_PATH)


# read in table
info(f'Reading table: {args.coverage_table}')
df = pd.read_csv(args.coverage_table, sep=SEP)

# empty lists to generate plots
dragen = []
pindel = []
dragen_pindel = []

# iterate through dataframe table, append to correct list
for _, row in df.iterrows():
  
  # extract needed data
  cov_set = row['set']
  rel_diff = row['relative difference']
  info(f'Extracting: {cov_set}\t\t{rel_diff}')

  # process and sort extracted data
  if cov_set == 'dragen':
    dragen.append(rel_diff)
  elif cov_set == 'pindel':
    pindel.append(rel_diff)
  elif cov_set == 'dragen-pindel':
    dragen_pindel.append(rel_diff)
  else: # extracted data not expected
    error('Extracted data unable to be sorted.')

combined_list = dragen + pindel + dragen_pindel
combined_list.sort()
print(combined_list)
bins = np.arange(int(min(combined_list)) - 1,
                 int(max(combined_list)) + 1,
                 BIN_WIDTH)

plt.hist(dragen,
         bins=bins, 
         histtype=HISTTYPE,
         stacked=STACKED,
         density=DENSITY,
         alpha=ALPHA + 0.1,
         color='green',
         label='dragen')
plt.hist(dragen_pindel,
         bins=bins,
         histtype=HISTTYPE,
         stacked=STACKED,
         density=DENSITY,
         alpha=ALPHA,
         color='purple',
         label='dragen-pindel')
plt.hist(pindel,
         bins=bins,
         histtype=HISTTYPE,
         stacked=STACKED,
         density=DENSITY,
         alpha=ALPHA + 0.1,
         color='red',
         label='pindel')

plt.title('Comparison of Coverage Set Density')
plt.legend(loc='upper right')
plt.show()


debug('%s end', SCRIPT_PATH)
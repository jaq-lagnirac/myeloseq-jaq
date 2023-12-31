# Justin Caringal
# Takes source TSV table and generates comparison plot
# set/source of coverage

import os
import sys
import argparse
import logging
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

SEP = '\t'

BIN_WIDTH = 0.25
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

Takes source TSV table and generates comparison plot.

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
parser.add_argument('-d', '--disable-table',
                    action='store_true',
                    help='Stop plot generation, only output err file')
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

# counts misc sets
misses = 0

# iterate through dataframe table, append to correct list
for index, row in df.iterrows():
  
  # extract needed data
  cov_set = row['set']
  rel_diff = row['relative difference']
  info(f'Extracting row {index}:\t{cov_set:<20}{rel_diff}')

  # process and sort extracted data
  if cov_set == 'dragen':
    dragen.append(rel_diff)
  elif cov_set == 'pindel':
    pindel.append(rel_diff)
  elif cov_set == 'dragen-pindel':
    dragen_pindel.append(rel_diff)
  else: # extracted data not expected
    error('Extracted data unable to be sorted.')
    misses += 1

info(f'Misc. sets extracted: {misses}')

# stops program depending on cmd line args
if args.disable_table:
  info('Plot generation disabled, exiting program.')
  sys.exit()

# generate bins
combined_list = dragen + pindel + dragen_pindel
min_bin = int(min(combined_list)) - 1.5 # takes floor min
max_bin = int(max(combined_list)) + 1.5 # takes ceiling max
bins = np.arange(min_bin, max_bin, BIN_WIDTH)

info(f'Generating {len(bins)} bins - Bin width: {BIN_WIDTH} - ' \
     f'Minimum bin: {min_bin} - Maximum bin: {max_bin}')

# generates plots
plt.hist(combined_list,
         bins=bins,
         histtype='step',
         stacked=STACKED,
         density=DENSITY,
         color='blue',
         label='combined')
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

# finalizes plot, displays it
plt.title('Comparison of Coverage Set Probability Density')
plt.xlabel('Relative Difference')
plt.ylabel('Probability Density')
plt.legend(loc='upper right')
plt.show()


debug('%s end', SCRIPT_PATH)
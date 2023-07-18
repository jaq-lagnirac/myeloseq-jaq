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
XLABEL = 'Relative Difference'
YLABEL = 'Probaility Density'


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

# generate bins
combined_list = dragen + pindel + dragen_pindel
bins = np.arange(int(min(combined_list)) - 1,
                 int(max(combined_list)) + 1,
                 BIN_WIDTH)

# stops program depending on cmd line args
if args.disable_table:
  info('Plot generation disabled, exiting program.')
  sys.exit()
  
# sets up subplots
figure, ((plot1, plot2), (plot3, plot4)) = plt.subplots(nrows=2, ncols=2)
fontdict = {'fontsize':10}

### generates plots

# plot 1 - dragen coverage
plot1.hist(dragen,
           histtype=HISTTYPE,
           stacked=STACKED,
           density=DENSITY,
           color='green',
           label='dragen')
plot1.set_title('Dragen Coverage', fontdict=fontdict)
plot1.set_xlabel(XLABEL, fontdict=fontdict)
plot1.set_ylabel(YLABEL, fontdict=fontdict)

# plot 2 - pindel coverage
plot2.hist(pindel,
           histtype=HISTTYPE,
           stacked=STACKED,
           density=DENSITY,
           color='red',
           label='pindel')
plot2.set_title('Pindel Coverage', fontdict=fontdict)
plot2.set_xlabel(XLABEL, fontdict=fontdict)
plot2.set_ylabel(YLABEL, fontdict=fontdict)

# plot 3 - dragen-pindel coverage
plot3.hist(dragen_pindel,
           histtype=HISTTYPE,
           stacked=STACKED,
           density=DENSITY,
           color='purple',
           label='dragen-pindel')
plot3.set_title('Dragen-Pindel Coverage', fontdict=fontdict)
plot3.set_xlabel(XLABEL, fontdict=fontdict)
plot3.set_ylabel(YLABEL, fontdict=fontdict)

# plot 4 - comparison coverage
plot4.hist(combined_list,
           bins=bins,
           histtype='step',
           stacked=STACKED,
           density=DENSITY,
           color='blue',
           label='combined')
plot4.hist(dragen,
           bins=bins, 
           histtype=HISTTYPE,
           stacked=STACKED,
           density=DENSITY,
           alpha=ALPHA + 0.1,
           color='green',
           label='dragen')
plot4.hist(dragen_pindel,
           bins=bins,
           histtype=HISTTYPE,
           stacked=STACKED,
           density=DENSITY,
           alpha=ALPHA,
           color='purple',
           label='dragen-pindel')
plot4.hist(pindel,
           bins=bins,
           histtype=HISTTYPE,
           stacked=STACKED,
           density=DENSITY,
           alpha=ALPHA + 0.1,
           color='red',
           label='pindel')
plot4.set_title('Comparison of Coverage Sets', fontdict=fontdict)
plot4.set_xlabel(XLABEL, fontdict=fontdict)
plot4.set_ylabel(YLABEL, fontdict=fontdict)
plot4.legend(loc='upper right', fontsize=8)

# finalizes plot, displays it
figure.tight_layout()
plt.show()


debug('%s end', SCRIPT_PATH)
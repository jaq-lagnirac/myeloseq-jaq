# Justin Caringal
# Takes source TSV table and generates plots
# set/source of coverage

import os
import sys
import argparse
import logging
import pandas as pd
import matplotlib.pyplot as plt

SEP = '\t'
FILE_SEP = '.'

EXIT = 'Exiting program.'
ROUNDING_DECIMALS = 3


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


debug('%s end', SCRIPT_PATH)
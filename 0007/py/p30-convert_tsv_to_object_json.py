#!/usr/bin/env python

import os
import json
import argparse
import logging
import pandas as pd

SCRIPT_PATH = os.path.abspath(__file__)
FORMAT = '[%(asctime)s] %(levelname)s %(message)s'
l = logging.getLogger()
lh = logging.StreamHandler()
lh.setFormatter(logging.Formatter(FORMAT))
l.addHandler(lh)
l.setLevel(logging.INFO)
debug = l.debug; info = l.info; warning = l.warning; error = l.error

DESCRIPTION = '''

Convert the first two columns of an input TSV to a JSON object,
with default column 0 as key and column 1 as value



'''

EPILOG = '''
'''

class CustomFormatter(argparse.ArgumentDefaultsHelpFormatter,
    argparse.RawDescriptionHelpFormatter):
  pass
parser = argparse.ArgumentParser(description=DESCRIPTION, epilog=EPILOG,
  formatter_class=CustomFormatter)

parser.add_argument('input_table')
parser.add_argument('-H', '--no-header', action='store_true',
    help='Input file has no header')
parser.add_argument('-K', '--key', action='store',
    help='Set column for key', default=0)
parser.add_argument('-V', '--value', action='store',
    help='Set column for value', default=1)
parser.add_argument('-v', '--verbose', action='store_true',
    help='Set logging level to DEBUG')

args = parser.parse_args()

if args.verbose:
  l.setLevel(logging.DEBUG)

debug('%s begin', SCRIPT_PATH)

sep = '\t'
header=0
if args.no_header:
  header=None
df = pd.read_csv(args.input_table, sep=sep, header=header)

obj = {}
for row_i, row in df.iterrows():
  k = args.key
  v = args.value
  if args.no_header:
    k = int(k)
    v = int(v)
  obj[row[k]] = row[v]

info(f'len(keys): {len(obj.keys())}')

json_string = json.dumps(obj, 
                         sort_keys=True, 
                         indent=2) 

print(json_string)

debug('%s end', (SCRIPT_PATH))

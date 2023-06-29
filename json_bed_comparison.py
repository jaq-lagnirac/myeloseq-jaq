# Justin Caringal
# Compares whether the coverage in the MyeloseqHD JSON files
# matches the coverage in the BED files


import os
import sys
import argparse
import logging
import json
import pandas as pd
import intervaltree

JSON_SUFFIX = '.report.json'
BED_SUFFIX = '.qc-coverage-region-1_full_res.bed'

SCRIPT_PATH = os.path.abspath(__file__)
FORMAT = '[%(asctime)s] %(levelname)s %(message)s'
l = logging.getLogger()
lh = logging.StreamHandler()
lh.setFormatter(logging.Formatter(FORMAT))
l.addHandler(lh)
l.setLevel(logging.INFO)
debug = l.debug; info = l.info; warning = l.warning; error = l.error

DESCRIPTION = '''
'''

EPILOG = '''
'''

class CustomFormatter(argparse.ArgumentDefaultsHelpFormatter,
    argparse.RawDescriptionHelpFormatter):
  pass
parser = argparse.ArgumentParser(description=DESCRIPTION, epilog=EPILOG,
  formatter_class=CustomFormatter)

parser.add_argument('directory',
                    help='main directory for comparison')
parser.add_argument('-v', '--verbose',
                    action='store_true',
                    help='Set logging level to DEBUG')

args = parser.parse_args()

if args.verbose:
  l.setLevel(logging.DEBUG)

debug('%s begin', SCRIPT_PATH)

for directory_name in os.listdir(args.directory):
  json_path = os.path.join(args.directory,
                           directory_name,
                           f'{directory_name}{JSON_SUFFIX}')
  bed_path = os.path.join(args.directory,
                          directory_name,
                          f'{directory_name}{BED_SUFFIX}')
  
  with open(json_path) as jp:
    json_file = json.loads(jp.read())
  
  # print(json_path)

  df = pd.read_csv(bed_path,
                   sep='\t',
                   header=None)
  try:
    tier13_columns = json_file['VARIANTS']['TIER1-3']['columns']
    tier13_data = json_file['VARIANTS']['TIER1-3']['data']
    # print(tier13_columns)
  except:
    error(f'{json_path} : Column does not exist')

  for entry in tier13_data:
    chrom = entry[tier13_columns.index('chrom')]
    pos = entry[tier13_columns.index('pos')]
    ref = entry[tier13_columns.index('ref')]
    alt = entry[tier13_columns.index('alt')]
  print(f'{chrom}\t{pos}\t{ref}\t{alt}')

debug('%s end', SCRIPT_PATH)
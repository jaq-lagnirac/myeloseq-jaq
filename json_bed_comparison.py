# Justin Caringal
# Compares whether the coverage in the MyeloseqHD JSON files
# matches the coverage in the BED files


import os
import sys
import argparse
import logging
import json
import pandas as pd
from intervaltree import Interval, IntervalTree

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



def process_json_entry(pos, ref, alt):
  # SNV
  if (len(ref) == 1) and (len(ref) == 1):
    start = pos
    end = pos
  # DELETION
  elif (len(ref) > 1) and (len(alt) == 1):
    start = pos + 1
    end = pos + len(ref) - 1
  # INSERTION
  elif (len(ref) == 1) and (len(alt) > 1):
    start = pos
    end = pos + 1
  else:
    start = pos
    end = start + len(alt) - 1

  return start, end



debug('%s begin', SCRIPT_PATH)

# Initialize counters
total_comparisons = 0
json_greater = 0
bed_greater = 0

for directory_name in os.listdir(args.directory):
  # Generate file paths
  json_path = os.path.join(args.directory,
                           directory_name,
                           f'{directory_name}{JSON_SUFFIX}')
  bed_path = os.path.join(args.directory,
                          directory_name,
                          f'{directory_name}{BED_SUFFIX}')
  
  
  # Process BED file
  df = pd.read_csv(bed_path,
                   sep = '\t',
                   names = ['chrom',
                            'start',
                            'end',
                            'coverage'])
  
  # Create interval tree from pandas dataframe
  bed_tree = IntervalTree()
  for index, row in df.iterrows():
    bed_tree[row['start'] : row['end']] = row['coverage']


  # Process JSON file
  
  with open(json_path) as jp:
    json_file = json.loads(jp.read())
  
  try:
    tier13_columns = json_file['VARIANTS']['TIER1-3']['columns']
    tier13_data = json_file['VARIANTS']['TIER1-3']['data']
    # print(tier13_columns)
    info(f'Accessing file: {json_path}')
  except:
    error(f'Tier 1-3 columns do not exist: {json_path}')
    continue


  # Comparing files
  for entry in tier13_data:
    # JSON data extraction
    chrom = entry[tier13_columns.index('chrom')]
    pos = int(entry[tier13_columns.index('pos')])
    ref = entry[tier13_columns.index('ref')]
    alt = entry[tier13_columns.index('alt')]
    json_cov = entry[tier13_columns.index('coverage')]
    
    start, end = process_json_entry(pos, ref, alt)

    # -1 accounting for 1-based to 0-based conversion
    # BED files are 0-based half-open [ )
    # JSON files are 1-based
    start -= 1

    # Comparison code
    json_comparison_interval = Interval(start, end, json_cov)
    bed_cov = bed_tree[start : end] # overlaps
    #bed_cov = bed_tree.envelop(start, end)
    for coverage in bed_cov:
      total_comparisons += 1
      if json_comparison_interval > coverage:
        json_greater += 1
        info('JSON has greater coverage than BED')
      elif coverage > json_comparison_interval:
        bed_greater += 1
        info('BED has greater coverage than JSON')
      else:
        info('Unknown comparison')

info(f'Total Comparisons: {total_comparisons}')
info(f'Cases where JSON coverage was greater: {json_greater}')
info(f'Cases where BED coverage was greater: {bed_greater}')

debug('%s end', SCRIPT_PATH)
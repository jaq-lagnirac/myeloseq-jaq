# Justin Caringal
# Generates directory of unsorted data into one that can be
# used by MyeloSeq test server

import os
import sys
import argparse
import logging
import shutil

DEFAULT_DIR = os.path.join('sorted_dir')

SCRIPT_PATH = os.path.abspath(__file__)
FORMAT = '[%(asctime)s] %(levelname)s %(message)s'
l = logging.getLogger()
lh = logging.StreamHandler()
lh.setFormatter(logging.Formatter(FORMAT))
l.addHandler(lh)
l.setLevel(logging.INFO)
debug = l.debug; info = l.info; warning = l.warning; error = l.error

DESCRIPTION = '''

Generates directory of unsorted data into one that can be
used by MyeloSeq test server

'''

EPILOG = '''
'''

class CustomFormatter(argparse.ArgumentDefaultsHelpFormatter,
    argparse.RawDescriptionHelpFormatter):
  pass
parser = argparse.ArgumentParser(description=DESCRIPTION, epilog=EPILOG,
  formatter_class=CustomFormatter)

parser.add_argument('-i',
                    nargs='+',
                    help='File or files to be sorted',
                    metavar='INPUT_FILES')
parser.add_argument('-o',
                    default=DEFAULT_DIR,
                    help='Output location of sorted directory',
                    metavar='MAIN_OUTPUT_DIRECTORY')
parser.add_argument('-v', '--verbose',
                    action='store_true',
                    help='Set logging level to DEBUG')

args = parser.parse_args()

if args.verbose:
  l.setLevel(logging.DEBUG)

file_sep = '/'
ext_sep = '.'

debug('%s begin', SCRIPT_PATH)

# if main output directory doesn't exist, creates one
if not os.path.exists(args.o):
  os.makedirs(args.o)

for file in args.i:
  # extracts full relative path name
  path_name = file.split(file_sep) # array
  full_name = path_name[len(path_name) - 1]
  info(f'Reading in: {full_name}')

#   # extracts extension name
#   ext_location = full_name.rindex(ext_sep)
#   ext_name = full_name[ext_location:]
# #  print(ext_name)
  
  # extracts name to be used for directory
  name_location = full_name.index(ext_sep)
  subdir_name = full_name[:name_location]

  # creates subdirectory if it doesn't exist
  output_subdir = os.path.join(args.o, subdir_name)
  if not os.path.exists(output_subdir):
    info(f'Creating subdirectory: {output_subdir}')
    os.mkdir(output_subdir)
  else:
    info(f'Already exists: {output_subdir}')

  info(f'Copying {full_name} to {output_subdir}')
  shutil.copy(file, output_subdir)

  

debug('%s end', (SCRIPT_PATH))
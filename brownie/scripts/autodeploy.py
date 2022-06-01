#
#
#

import os
import time
import glob
from os.path import dirname, basename, isfile, join

# Load all the files in the directory checking every 1 second for a change
# from the previous check

old_modules = glob.glob(join(dirname(__file__), "*.py"))
while True:
    modules = glob.glob(join(dirname(__file__), "*.py"))

    changed = diff(old_modules, modules)

    __all__post = [ basename(f)[:-3] for f in changed if isfile(f) and not f.endswith('__init__.py')]
    print(__all__post)

    time.sleep(1)

    old_modules = modules


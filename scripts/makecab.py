import os
import sys
import datetime
import cabarchive

# if first arg is '--test'
if (len(sys.argv) == 2 and sys.argv[1] == '--test'):
    sys.exit(0)

# if first arg is '--help'
if (len(sys.argv) < 3 or len(sys.argv) == 2 and sys.argv[1] == '--help'):
    print("Usage: python makecab.py <path to folder to compress> <path to output cab file>")
    sys.exit(0)

# get the folder to compress as absolute path
folder = os.path.abspath(sys.argv[1])
output = os.path.abspath(sys.argv[2])

# create the cab archive
cab = cabarchive.CabArchive()

# walk the folder and add all files to the cab archive
for root, dirs, files in os.walk(folder):
    for file in files:
        # print the file name
        print("ADD", file)
        # read file modification time as datetime
        mtime = os.path.getmtime(os.path.join(root, file))
        mtime = datetime.datetime.fromtimestamp(mtime)
        # read file into bytes
        with open(os.path.join(root, file), 'rb') as f:
            fc = f.read()
            cab[file] = cabarchive.CabFile(buf=fc, mtime=mtime)

# write the cab archive to the output file
print("CAB Compressing...")
with open(output, "wb") as f:
    f.write(cab.save(compress=True))
print("CAB Done.")

import os
import time
import subprocess

now = time.time()

for filename in os.listdir('.'):
    os.utime(filename, (now, now))
    subprocess.run(["git", "add", filename])

subprocess.run(["git", "commit", "-m", "update from another repository"])
import matplotlib.pyplot as plt
import pandas as pd

SEP = '\t'

df = pd.read_csv('dragen.tsv', sep=SEP)

diff = df['diff']

print(diff)

plt.bar(diff)

plt.show()

import pygal
import pandas as pd
import glob
from datetime import datetime

lowerbound = 10;

print("List of the csv file in the current folder: ")
namelist = []
for index, fname in enumerate(glob.glob("*.csv")):
    print (str(index)+". "+fname)
    namelist.append(fname)

input = input("Input the index of the CSV file you want to render: ")
input = int(input)

data = pd.read_csv(namelist[input])
print("rendering Document: "+namelist[input])



data.columns = ["Time", "X", "T","Delay"]
result = data.groupby("Time", as_index = False)["Delay"].mean()
result.sort_values(by=['Time'], ascending=True)

Timelist = []
count = 0
for index, time in enumerate(result["Time"]):
    ts = int(time)
    utc_format = datetime.utcfromtimestamp(ts)
    tup1 = (utc_format, result["Delay"][index])
    Timelist.append(tup1)
    count = index
print(count)    

max_delay = result["Delay"].max()
max_index = result["Delay"].idxmax()
print(max_index)

i = max_index
v = max_delay
while v > lowerbound and i > 5:
    i-=1
    v = result["Delay"][i]

start_point = i-5

i = max_index
v = max_delay
while v > lowerbound and i < count - 5:
    i+=1
    v = result["Delay"][i]

end_point = i+5


TL2 = Timelist[start_point:end_point]


datetimeline = pygal.DateTimeLine( show_x_guides=True,
    x_label_rotation=15, dots_size = 0.5, logarithmic=True, title = namelist[input], stroke = True,
    x_value_formatter=lambda dt: dt.strftime('%b/%d/%Y %I:%M:%S %p'))
datetimeline.add("Delay", Timelist)
datetimeline.render_in_browser()


datetimeline2 = pygal.DateTimeLine( show_x_guides=True,
    x_label_rotation=15, dots_size = 0.5, logarithmic=True, title = namelist[input]+"(peak)", stroke = True,
    x_value_formatter=lambda dt: dt.strftime('%b/%d/%Y %I:%M:%S %p'))
datetimeline2.add("Delay", TL2)

outname2 = namelist[input][:-4]+".png"
datetimeline.render_to_png(outname2)

outname2 = namelist[input][:-4]+"-peak.png"
datetimeline2.render_to_png(outname2)



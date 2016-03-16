LIMIT = 3072
STACK_SIZE = 1024
MAIN = main.js


in = main.js
out = main.png
title = main

all: poster

poster:
	node --max-old-space-size=$(LIMIT) --stack-size=$(STACK_SIZE) $(MAIN) --width=1650 --height=2550 < $(in) > $(out)

book:
	node --max-old-space-size=$(LIMIT) --stack-size=$(STACK_SIZE) $(MAIN) --width=2660 --height=4100 --pixels=18 --title=$(title)  < $(in)

front:
	node --max-old-space-size=$(LIMIT) --stack-size=$(STACK_SIZE) $(MAIN) --width=2660 --height=4100 --pixels=266 --title=$(title)  < $(in)

clean:
	rm -f *.png


#!/bin/bash

nameIndex=1
for i in `cat names.txt`; do
	mv baike/$nameIndex.txt baike/$nameIndex.html
	#curl -L "https://baike.baidu.com/item/$i">baike/$nameIndex.txt
	let nameIndex=$nameIndex+1
done
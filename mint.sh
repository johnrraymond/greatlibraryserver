#!/bin/bash

#value=`cat $2`

convert -size 300x154 xc:none -gravity southeast \
          -stroke black -pointsize 20 -strokewidth 4 -annotate 0 @$2 \
          -background none -shadow 100x2+0+0 +repage \
          -stroke none -pointsize 20  -fill white     -annotate 0 @$2 \
          bookmark.png  +swap -gravity southeast  -geometry +2+2 \
          -composite  $2.png

convert -size 300x154 xc:none -gravity northeast \
	  -stroke none -pointsize 20  -fill black     -annotate 0 'Token: '$3 \
	  $2.png  +swap -gravity northeast  -geometry +5+15 \
	  -composite  $2.jpg

rm $2.png

cnxml2md
========

Compile [OpenStax](http://openstax.org) textbook [CNXML](http://cnx.org/contents/hQ2d68e4@10/Frequently-Asked-Questions) files to Markdown format.

I created this because OpenStax doesn't support other eReader devices besides Kindle, and Markdown is readable as well as easily transpilable into other formats like HTML, MOBI, etc.  I also tend to have weird motivations.

## Installation

```npm install -g cnxml2md```

## Use

Download a .zip version of a textbook from OpenStax, which should contain directories for each chapter of said textbook along with images and **.cnxml** files.

Inside the unzipped directory, run `cnxml2md`.

## Notes

Doesn't support every CNXML element yet, and only has been tested on Biology 1.10.  I suspect it will definitely fail with any mathematics textbook.  But the basic concept is there for textbooks mostly made up of paragraphs and figures.

## License

The MIT License (MIT)
Copyright (c) 2016 Ben Titcomb

See `LICENSE.txt` for details.
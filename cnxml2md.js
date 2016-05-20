#!/usr/bin/env node

'use strict';
const gulp     = require('gulp')
const through  = require('through-gulp')
const cheerio  = require('cheerio')
const rename   = require("gulp-rename")
const pretty   = require('pretty-data2').pd
const path     = require('path')

const titleize = (string) => {
  return "\n" + string + "\n" + Array(string.length).fill("=").join("") + "\n"  
}

const converters = {
  PARA: (el) => {
    return el.text() + "\n"
  },
  TERM: (el) => {
    let parent = el.parent().prop('tagName')
    if(parent == 'DEFINITION'){
      return
    } else if (parent == 'PARA'){
      return "**" + el.text() + "**"
    }
  },
  FIGURE: (el) => {
    let subfigures = el.find('subfigure')
    if(subfigures.length){
      let output = []
      el.find('subfigure').each((i, subfigure) => {
        let $subfigure = el.find(subfigure)
        let string     = "![" + $subfigure.find('media').attr('alt') + "](" + $subfigure.find('image').attr('src') + ")" 
        output.push(string)
      })
      el.find('caption').each((i, caption) => {
        let $caption = el.find(caption)
        output.push("\n*" + $caption.text() + "*\n")
      })
      el.replaceWith(output.join("\n\n"))
    } else {
      el.replaceWith("\n\n![" + el.find('caption').text() + "](" + el.find('image').attr('src') + ")\n\n")
    }
  },
  METADATA: (el) => {
    return ''
  },
  LIST: (el) => {
    return el.text()
  },
  ITEM: (el) => {
    return "- " + el.text()
  },
  CONTENT: (el) => {
    return el.text()
  },
  TITLE: (el) => {
    let parent = el.parent().prop('tagName')
    let string = el.text()
    if(parent == 'SECTION'){
      return "\n## " + string + "\n"
    } else {
      return titleize(string)
    }
  },
  EMPHASIS: (el) => {
    return "*" + el.text() + "*"
  },
  SECTION: (el) => {
    return el.text()
  },
  GLOSSARY: (el) => {
    return titleize("Glossary") + el.text()
  },
  DEFINITION: (el) => {
    return el.find('term').text() + "\n: " + el.find('meaning').text() + "\n"
  },
  DOCUMENT: (el) => {
    return el.text()
  },
  MEANING: (el) => {
    return
  },
  SOLUTION: (el) => {
    return ''
  },
  default: (el) => { return }
}

const render = (el) => {
  if(typeof el == 'string'){
    return el;
  } else {
    let children = el.children()
    children.each((i, child) => {
      let $child = el.find(child)
      let renderedChild = render($child)
      if (renderedChild != undefined){
        $child.replaceWith(renderedChild)
      }
    })
    let tagName  = el.prop('tagName')
    return (converters[tagName] || converters.default)(el)
  }
}

const filter = through(function(file, encoding, callback) {
  let xml        = file._contents.toString()
    .replace(/^\s+/mg, "") // prettify then remove indentation
    .replace("\r", "\n")  // normalize newlines
  let $          = cheerio.load(xml, {
    xmlMode: false
  })
  let markdown   = render($('document'))
    .replace(/\n{3,}/g, '\n\n') // remove too many newlines
    .replace(/^\n*/, '')        // remove newlines at start of document
  file._contents = new Buffer(markdown)
  this.push(file)
  callback()
})

gulp.src('./**/index.cnxml')
  .pipe(filter)
  .pipe(rename((path) => { path.extname = ".md"}))
  .pipe(gulp.dest('./'))
  // .pipe( gulp.dest( function( file ) { return path.join(path.dirname(file.path), '') }))

  // .pipe(gulp.dest('./'))

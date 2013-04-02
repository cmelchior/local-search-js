local-search-js
===============

This project is a POC for a website search mechanism that can search  large
json sets locally while still providing autocomplete options and a responsive UI.

The idea is two-fold:

1. Offload search to Web Worker thread if this is available in the browser.
2. Enable powerful search options using a simple querying language using a 
   Parsing Expression Grammar (PEG).

The POC also contains options for disabling web workers and/or sending data
to the worker so performance testing is easier.


Search Language
--------------
The search language supports most logical operators like "AND", "&&" or "||" and
implicit variabels, ie. "> 7" is automatically converted to "x > 7".

The language is specified using the following formal grammar: 

```
start
  = l:predicate space c:conditional space r:start  { return l + " " + c + " " + r; }
  / predicate

predicate
  = lp:"(" p:predicate rp:")" { return lp + p + rp; }
  / lp:token space o:operator space rp:token { return lp + " " + o + " " + rp; }
  / v:val { return "${1} == " + v; }

conditional
  = "&&"
  / "||"
  / c:"&" { return "&&"; }
  / c:"|" { return "||"; }
  / c:"AND"i { return "&&"; }
  / c:"OR"i { return "||"; }

operator
  = ">="
  / ">"
  / "<="
  / "<"
  / "=="
  / "=" { return "=="; }

token
  = val
  / var
  / "" { return "${1}"; }

val
  = digits:[0-9-]+ { return parseInt(digits.join(""), 10); }

var
  = [a-z]i { return "${1}"; }

space
 = [' '\t\r\n]
 / ""
```
PEG.js has been used to create a language parser


Credit
--------------
http://pegjs.majda.cz/ PEG.js for the language parser.

http://www.thespoils.com The Spoils for creating a fun card game that fueled
this POC.





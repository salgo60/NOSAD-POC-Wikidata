# NOSAD Wikidata POC
POC Nosad koppling WD ( [WD Q110192600](https://www.wikidata.org/wiki/Q110192600))

Se om vi kan koppla ihop Wikipedia med NOSAD som finns i <a target=_blank href="https://sweopendata.wikibase.cloud/wiki/NOSAD">Wikibase.cloud</a> dvs. en "kopia" av Wikidata
* Synpunkter/tankar lämnas i <a href="https://github.com/salgo60/NOSAD/issues">Issues</a>
* Test sidor 
  *  [API](https://salgo60.github.io/NOSAD-POC-Wikidata//?q=Q165194)
  * [Öppna data](https://salgo60.github.io/NOSAD-POC-Wikidata/?q=Q309901)
  * [Open by default](https://salgo60.github.io/NOSAD-POC-Wikidata/?q=Q16584519)
  * [Open Goverment](https://salgo60.github.io/NOSAD-POC-Wikidata/?q=Q720829) -  WD [Q720829](https://www.wikidata.org/wiki/Q720829)
  
## Test NOSAD kopping Wikipedia

To enable on all platforms you need to have a Wikipedia account and then :

1. Visit your global.js page on Meta: [Special:MyPage/global.js](https://meta.wikimedia.org/wiki/Special:MyPage/global.js)

2. Copy in the code:

> mw.loader.load( '//meta.wikimedia.org/w/index.php?title=User:Salgo60/NOSAD.js&action=raw&ctype=text/javascript' );

3. Click "Publish changes"

Se example [global.js](https://meta.wikimedia.org/wiki/User:Salgo60/global.js)

var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var limit = require("simple-rate-limiter");
//var request = require('request');
var request = limit(require("request")).to(5).per(1000);
var cheerio = require('cheerio');
var async = require('async');
var app     = express();	
var count = 0;

var server = app.listen(app.get('port'), function() {
  //debug('Express server listening on port ' + server.address().port);
});
server.timeout = 600000;

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.static(path.join(__dirname, 'public')));		
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', { title: 'SETFS', message: 'Hello there!' })
})
app.get('/dl', function(req, res){
  const file = `${__dirname}/fs.txt`;
  res.download(file); // Set disposition and send it.
});		
app.post('/', function(req, res){		
			res.set("Content-Type", "text/html");		
			fs.truncate('fs.txt', 0, function(){console.log('done truncate file fs.txt.')})					
			fromdate = req.body.datefrom;
			todate = req.body.dateto;									
			pageamount = 1;
			var done = 0;	
			var done1 = 0;			
			var stockobj = [];
			url = 'https://www.set.or.th/set/newslist.do?source=&symbol=&securityType=&newsGroupId=3&headline=F45&from='+encodeURIComponent(fromdate)+'&to='+encodeURIComponent(todate)+'&submit=Search&language=en&country=US#content';			
			var time = 1000;
			request(url, function(error, response, html){
					if(!error){					
						var $ = cheerio.load(html);					
						pageamount = $('.nav-number li a').last().text();
						
						if (!pageamount) {
							pageamount =1;
						}							
						for	(z=0;z<pageamount;z++){							
							page = '&currentpage='+z;							
							url = 'https://www.set.or.th/set/newslist.do?source=&symbol=&securityType=&newsGroupId=3&headline=F45&from='+encodeURIComponent(fromdate)+'&to='+encodeURIComponent(todate)+'&submit=Search';
							url = url + page;
							url = url + '&language=en&country=US';							
							done1++;												
							request(url, function(error, response, html){																							
								if(!error){															
									var $ = cheerio.load(html);										
									$('.table-info-wrap tr').each(function(i,elem){								
										if(i==0){
											return true;
										}
										var arrCnt = i;
										var stockarr = [];										
										var dlurl =   'http://www.set.or.th'+$(this).find('a').attr('href');
										var datetime = $(this).find('td').first().text().trim();
										var stockname = $(this).find('td').next().next().html();
										stockarr.push(stockname);		
										stockobj[stockname] = [];
										done++;				
									  											
										request(dlurl, function(error, response, html){																																																						
											if(!error){																																
											
												var $dl = cheerio.load(html);
												var content = $dl('.newsstory-pre-font').html();	
												if(content){
													
													var content = content.split(' ');	
													var loop = 0;								
													for (var i = 0; i < content.length;i++){		//loop ทั้งหมด Split by space																	
															if (content[i].trim().indexOf('(loss)') >= 0){
																loop = loop + 1;
																var k = 0;											
																for (var j = 1; j < content.length-i;j++){						//loop จนกว่าจะเจอตัวเลข																						
																	if (content[i+j].trim().search(/^[0-9.,()]+/) == 0){																														
																	
																		k = k + 1;															
																		if ( k == 1){
																			
																			netprofit = content[i+j].trim().cleanup();	
																			if 	(netprofit==''){
																				break;
																			}																				
																			stockarr.push(netprofit);																																				
																			stockobj[stockname].eps = netprofit;
																		}else if (k == 2){																			
																			netprofit_prev = content[i+j].trim().cleanup();																																												
																			stockarr.push(netprofit_prev);
																			stockobj[stockname].eps_prev = netprofit_prev;
																			break;
																		}
																	}																						
																}
															}else if (content[i].trim().indexOf('(baht)') >= 0){
																loop = loop + 1;
																var l = 0;
																for (var h = 1; h < content.length-i;h++){						//loop จนกว่าจะเจอตัวเลข																						
																	if (content[i+h].trim().search(/^[0-9.,()]+/) == 0){																		
																		l = l + 1;															
																		if ( l == 1){
																			netprofit = content[i+h].trim().cleanup();												
																			stockarr.push(netprofit);	
																			stockobj[stockname].netprofit = netprofit;																			
																		}else if (l == 2){
																			netprofit_prev = content[i+h].trim().cleanup();																										
																			stockarr.push(netprofit_prev);
																			stockobj[stockname].netprofit_prev = netprofit_prev;
																			break;
																		}
																	}																						
																}											
															}	
																										
															if (loop == 2){											
																	break;
															}
													} //for
												}
												stockarr.push(datetime);
												stockobj[stockname].datetime = datetime;
												res.write(stockname + ' - processing done!<br/>');
												//res.write(stockarr.join('| ')+'\n');
												/* fs.appendFile('fs.txt', stockarr.join('| ') +'\n', function (err) {
												});*/				
												done--;																								
												if(done == 0 && done1 == 0){		
													for (var key in stockobj) {
														if (stockobj.hasOwnProperty(key)) {
															var str = key+'|'+ stockobj[key].eps + '|' + stockobj[key].eps_prev + '|' + stockobj[key].netprofit + '|' + stockobj[key].netprofit_prev + '|' + stockobj[key].datetime+'\n';
															console.log(key+'|'+ stockobj[key].eps + '|' + stockobj[key].eps_prev + '|' + stockobj[key].netprofit + '|' + stockobj[key].netprofit_prev + '|' + stockobj[key].datetime);															
															//res.write(str);
															fs.appendFile('fs.txt', str, function (err) {
																
															});					
														}
													}												
													console.log('done');
													res.write('Done!');	
													
													res.write('Download file <a href="/dl/">fs.txt</a>.')
													res.end();												
												}
											}
											
										})																	  										
										return;
									});	//table-info
									done1--;
								}
							})
						}//for page amount
					}					
			})										
})



  function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

		

function decodeHTMLEntities (str) {
  if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
  }
  return str;
}

// Attaching our method to the String Object
String.prototype.cleanup = function() {
   var str = this.toLowerCase().replace(/[^0-9.,()]+/g, "");
   str = str.replace("()","");
   return str;
}

app.listen(process.env.PORT || '8081');
console.log('Magic happens on port 8081');
exports = module.exports = app; 	
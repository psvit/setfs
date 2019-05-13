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
	
var stocks =["2S","A","AAV","ABC","ABICO","ABPIF","ACAP","ACC","ADAM","ADVANC","AEC","AEONTS","AF","AFC","AGE","AH","AHC","AI","AIE","AIRA","AIT","AJ","AJD","AKP","AKR","ALUCON","AMANAH","AMARIN","AMATA","AMATAR","AMATAV","AMC","ANAN","AOT","AP","APCO","APCS","APURE","APX","AQ","AQUA","ARIP","ARROW","AS","ASEFA","ASIA","ASIAN","ASIMAR","ASK","ASN","ASP","ATP30","AUCT","AYUD","BA","BAFS","BANPU","BAT-3K","BAY","BBL","BCH","BCP","BDMS","BEAUTY","BEC","BEM","BFIT","BGT","BH","BIG","BIGC","BJC","BJCHI","BKD","BKI","BKKCP","BLA","BLAND","BLISS","BM","BOL","BR","BRC","BROCK","BROOK","BRR","BSBM","BSM","BTC","BTNC","BTS","BTSGIF","BUI","BWG","CBG","CCET","CCN","CCP","CEN","CENTEL","CFRESH","CGD","CGH","CHARAN","CHEWA","CHG","CHO","CHOTI","CHOW","CHUO","CI","CIG","CIMBT","CITY","CK","CKP","CM","CMO","CMR","CNS","CNT","COL","COLOR","COM7","CPALL","CPF","CPH","CPI","CPL","CPN","CPNCG","CPNRF","CPR","CPTGF","CRANE","CRYSTAL","CSC","CSL","CSP","CSR","CSS","CTARAF","CTW","CWT","DAII","DCC","DCON","DCORP","DELTA","DEMCO","DIF","DIMET","DNA","DRACO","DRT","DSGT","DTAC","DTC","DTCI","DTCPF","E","EA","EARTH","EASON","EASTW","ECF","ECL","EE","EFORL","EGATIF","EGCO","EIC","EMC","EPCO","EPG","ERW","ERWPF","ESSO","ESTAR","EVER","F&D","FANCY","FE","FER","FIRE","FMT","FNS","FOCUS","FORTH","FPI","FSMART","FSS","FUTUREPF","FVC","GBX","GC","GCAP","GEL","GENCO","GFPT","GIFT","GJS","GL","GLAND","GLOBAL","GLOW","GOLD","GOLDPF","GPSC","GRAMMY","GRAND","GREEN","GSTEL","GTB","GUNKUL","GVREIT","GYT","HANA","HFT","HMPRO","HOTPOT","HPF","HPT","HTC","HTECH","HYDRO","ICC","ICHI","IEC","IFEC","IFS","IHL","ILINK","IMPACT","INET","INOX","INSURE","INTUCH","IRC","IRCP","IRPC","IT","ITD","IVL","J","JAS","JASIF","JCP","JCT","JMART","JMT","JSP","JTS","JUBILE","JUTHA","JWD","K","KAMART","KASET","KBANK","KBS","KC","KCAR","KCE","KCM","KDH","KGI","KIAT","KKC","KKP","KOOL","KPNPF","KSL","KTB","KTC","KTECH","KTIS","KTP","KWC","KYE","L&E","LALIN","LANNA","LDC","LEE","LH","LHBANK","LHHOTEL","LHK","LHPF","LHSC","LIT","LOXLEY","LPH","LPN","LRH","LST","LTX","LUXF","LVT","M","MACO","MAJOR","MAKRO","MALEE","MANRIN","MATCH","MATI","MAX","MBAX","MBK","MBKET","MC","M-CHAI","MCOT","MCS","MDX","MEGA","METCO","MFC","MFEC","MIDA","M-II","MILL","MINT","MIPF","MIT","MJD","MJLF","MK","ML","MNIT","MNIT2","MNRF","MODERN","MONO","MONTRI","MOONG","M-PAT","MPG","MPIC","MSC","M-STOR","MTI","MTLS","NBC","NC","NCH","NCL","NDR","NEP","NEW","NEWS","NFC","NINE","NKI","NMG","NNCL","NOBLE","NOK","NPK","NPP","NSI","NTV","NUSA","NWR","NYT","OCC","OCEAN","OGC","OHTL","OISHI","ORI","OTO","PACE","PAE","PAF","PAP","PATO","PB","PCA","PCSGH","PDG","PDI","PE","PERM","PF","PG","PHOL","PICO","PIMO","PJW","PK","PL","PLANB","PLAT","PLE","PM","PMTA","POLAR","POMPUI","POPF","POST","PPF","PPM","PPP","PPS","PR","PRAKIT","PRANDA","PREB","PRECHA","PRG","PRIN","PRINC","PRO","PS","PSL","PSTC","PT","PTG","PTL","PTT","PTTEP","PTTGC","PYLON","Q-CON","QH","QHHR","QHOP","QHPF","QLT","QTC","RAM","RATCH","RCI","RCL","RICH","RICHY","RML","ROBINS","ROCK","ROH","ROJNA","RP","RPC","RS","RWI","S","S & J","S11","SABINA","SAFARI","SALEE","SAM","SAMART","SAMCO","SAMTEL","SANKO","SAPPE","SAT","SAUCE","SAWAD","SAWANG","SBPF","SC","SCAN","SCB","SCC","SCCC","SCG","SCI","SCN","SCP","SEAFCO","SEAOIL","SE-ED","SENA","SF","SFP","SGF","SGP","SHANG","SIAM","SIM","SIMAT","SINGER","SIRI","SIRIP","SIS","SITHAI","SKR","SLP","SMART","SMC","SMG","SMIT","SMK","SMM","SMPC","SMT","SNC","SNP","SOLAR","SORKON","SPA","SPACK","SPALI","SPC","SPCG","SPF","SPG","SPI","SPORT","SPPT","SPRC","SPVI","SPWPF","SR","SRICHA","SSC","SSF","SSI","SSPF","SSSC","SST","SSTPF","SSTSS","STA","STANLY","STAR","STEC","STHAI","STPI","SUC","SUPER","SUSCO","SUTHA","SVH","SVI","SVOA","SWC","SYMC","SYNEX","SYNTEC","T","TACC","TAE","TAKUNI","TAPAC","TASCO","TBSP","TC","TCAP","TCB","TCC","TCCC","TCIF","TCJ","TCMC","TCOAT","TEAM","TF","TFD","TFG","TFI","TFUND","TGCI","TGPRO","TGROWTH","TH","THAI","THANA","THANI","THCOM","THE","THIF","THIP","THL","THRE","THREL","TIC","TICON","TIF1","TIP","TIPCO","TISCO","TIW","TK","TKN","TKS","TKT","TLGF","TLHPF","TLOGIS","TLUXE","TMB","TMC","TMD","TMI","TMILL","TMT","TMW","TNDT","TNH","TNITY","TNL","TNP","TNPC","TNPF","TOG","TOP","TOPP","TPA","TPAC","TPBI","TPC","TPCH","TPCORP","TPIPL","TPOLY","TPP","TPROP","TR","TRC","TREIT","TRIF","TRS","TRT","TRU","TRUBB","TRUE","TSC","TSE","TSF","TSI","TSR","TSTE","TSTH","TT","TT&T","TTA","TTCL","TTI","TTL","TTLPF","TTTM","TTW","TU","TUCC","TU-PF","TVD","TVI","TVO","TVT","TWP","TWPC","TWZ","TYCN","U","UAC","UBIS","UEC","UKEM","UMI","UMS","UNIPF","UNIQ","UOBKH","UP","UPA","UPF","UPOIC","URBNPF","UREKA","UT","UTP","UV","UVAN","UWC","VARO","VGI","VI","VIBHA","VIH","VNG","VNT","VPO","VTE","WACOAL","WAVE","WG","WHA","WHABT","WHAPF","WHART","WICE","WIIK","WIN","WINNER","WORK","WORLD","WP","WR","XO","YCI","YNP","YUASA","ZMICO"];
var count = 0;

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
		
app.post('/', function(req, res){									
			fromdate = req.body.datefrom;
			todate = req.body.dateto;
									
			pageamount = 1;
			var done = 0;	
			var done1 = 0;
			//url = 'http://www.set.or.th/set/newslist.do?to='+todate+'&headline=&submit=%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%B2&symbol=&from='+fromdate+'&newsType=19&exchangeSymbols=&companyNews=on&company=true&exchangeNews=on&exchange=true'			
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
							//url = 'http://www.set.or.th/set/newslist.do?to='+todate+'&headline=&submit=%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%B2&symbol=&from='+fromdate+'&newsType=19&exchangeSymbols=&companyNews=on&company=true&exchangeNews=on&exchange=true'							
							url = 'https://www.set.or.th/set/newslist.do?source=&symbol=&securityType=&newsGroupId=3&headline=F45&from='+encodeURIComponent(fromdate)+'&to='+encodeURIComponent(todate)+'&submit=Search';
							url = url + page;
							url = url + '&language=en&country=US';
							//console.log(url);
							done1++;
							//console.log(url);											
							request(url, function(error, response, html){																							
								if(!error){															
									var $ = cheerio.load(html);										
									$('.table-info-wrap tr').each(function(i,elem){								
										if(i==0){
											return true;
										}
										var stockarr = [];
										var dlurl =   'http://www.set.or.th'+$(this).find('a').attr('href');
										var datetime = $(this).find('td').first().text().trim();
										var stockname = $(this).find('td').next().next().html();
										stockarr.push(stockname);
													
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
																for (var j = 0; j < content.length-i;j++){						//loop จนกว่าจะเจอตัวเลข																						
																	if (content[i+j].trim().search(/^[0-9.,()]+$/) == 0){																														
																	
																		k = k + 1;															
																		if ( k == 1){
																			netprofit = content[i+j].trim();												
																			stockarr.push(netprofit);																	
																		}else if (k == 2){
																			netprofit_prev = content[i+j].trim();																										
																			stockarr.push(netprofit_prev);
																			break;
																		}
																	}																						
																}
															}else if (content[i].trim().indexOf('(baht)') >= 0){
																loop = loop + 1;
																var k = 0;
																for (var j = 0; j < content.length-i;j++){						//loop จนกว่าจะเจอตัวเลข																						
																	if (content[i+j].trim().search(/^[0-9.,()]+$/) == 0){																		
																		k = k + 1;															
																		if ( k == 1){
																			netprofit = content[i+j].trim();												
																			stockarr.push(netprofit);																	
																		}else if (k == 2){
																			netprofit_prev = content[i+j].trim();																										
																			stockarr.push(netprofit_prev);
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
												res.write(stockarr.join('| ')+'\n');
												/* fs.appendFile('fs.txt', stockarr.join('| ') +'\n', function (err) {
												});*/				
												done--;																								
												if(done == 0 && done1 == 0){										
													res.write('Done!');	
													res.end();												
												}
											}
											
											
											
											
											
										})
																	  
										
										return;
									});																								
									done1--;
								}
							})
						}
					}					
			})
										
})

		
		
app.get('/setfsdl', function(req, res){
			url = 'http://www.set.or.th/set/newslist.do?company=true&companyNews=on&exchange=true&exchangeNews=on&symbol=&exchangeSymbols=&newsType=23&headline=&from=10%2F09%2F2016&to=10%2F10%2F2016&submit=%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%B2&language=th&country=TH#content';
			request(url, function(error, response, html){
				if(!error){
					var $ = cheerio.load(html);
					$('.table-info-wrap tr').each(function(i,elem){
						
						var dlurl =   'http://www.set.or.th'+$(this).find('a').attr('href');
						var stockname = $(this).find('td').next().next().html();											
						
						request(dlurl, function(error, response, html){
							if(!error){								
								var $dl = cheerio.load(html);
								var zipfile = $dl('.displayContent a').attr('href');
								download(stockname,zipfile);
								console.log(zipfile);								
								console.log(stockname);
							}
							
						})
						
					});
				}
			})
			res.send('<h1>Hello !!</h1>');
})

app.get('/scrape', function(req, res){
	var jsonstock = new Array();				
	//for (var i = 0; i<= 10  ; i++){
	
	async.forEachSeries(stocks,function(stock,callback){			
		var stockname = stocks[count];		
		//url = 'http://www.set.or.th/set/factsheet.do?symbol='+stock;			
		url = 'http://financials.morningstar.com/ajax/ReportProcess4HtmlAjax.html?&t=XBKK:'+stockname+'&region=tha&culture=en-US&cur=&reportType=is&period=3&dataType=A&order=asc&columnYear=5&curYearPart=1st5year&rounding=3&view=raw&r=431135&callback=jsonp1457065190181&_=1457065347015'
		
		request(url, function(error, response, html){
			if(!error){								
				html = html.substr(html.indexOf('(')+1);				
				html =  html.substr(0,html.length-1);				
				var stockarr = []								
				var stockstr;
				
				stockarr.push(stockname);

				if (IsJsonString(html)){					
					var obj = JSON.parse(html);
					html = obj.result;						
					if(html!=null){
					
						var $ = cheerio.load(html);								
						
						for(var i = 1 ; i <= 5; i++){
							var revenue = $('#data_i1 > #Y_'+i).html();
						
							if (revenue == null){
								revenue = $('#data_i32 > #Y_'+i).html();
							}
							if (revenue == null){
								revenue = $('#data_tts1 > #Y_'+i).html();													
							}
							stockarr.push(revenue);						
						}

						for(var i = 1 ; i <= 5; i++){
							var profit = $('#data_i80 > #Y_'+i).html();
							if (profit == null) {
								profit = $('#data_i70 > #Y_'+i).html();
							}
							if (profit == null) {
								profit = $('#data_i50 > #Y_'+i).html();
							}							
							stockarr.push(profit);
					}					
					}
				}

				fs.appendFile('message.txt', stockarr.join('| ') +'\n', function (err) {
				});
			/*
				var stock = new Object();							
				stock.name = stockname;
				stock.revnue = [];
				stock.netinc = [];

				if (IsJsonString(html)){
					var obj = JSON.parse(html);
					html = obj.result;				
					
			//		var salechg = $('td td tr:contains(อัตราการเปลี่ยนแปลงยอดขาย)').find('td:nth-child(2)').html();
			//		var stock  = $('.factsheet-heading').html();					
					// var revnue = []
					// var netinc = []
					for(var i = 1 ; i <= 5; i++){
						stock.revnue.push($('#data_i1 > #Y_'+i).html());
						stock.netinc.push($('#data_i80 > #Y_'+i).html());
					}
				}

				jsonstock.push(stock);
				*/

				// var revnue = $('#data_i1 > #Y_1').html();
				// var revnue2 = $('#data_i1 > #Y_2').html();
				//var netinc = $('td td tr:contains(อัตราการเปลี่ยนแปลงยอดขาย)').find('td:nth-child(2)').html();
				//console.log(JSON.stringify(stock));
				// console.log(revnue);
				// console.log(revnue2);
										
				callback();
			}		
		})	
		count +=1;		
	});


	//}
	
	
	//console.log (json);
	/*fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){		
        console.log('File successfully written! - Check your project directory for the output.json file');
    })*/
	
		
    res.send('Check your console!');
})

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

app.listen(process.env.PORT || '8081');
console.log('Magic happens on port 8081');
exports = module.exports = app; 	
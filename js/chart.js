var chart = {};


chart.init = function(){

	$(".accordion-title").on("click", function () {
		// タイトルにopenクラスを付け外しして矢印の向きを変更
		$(this).toggleClass("open", 300);
		// クリックした次の要素を開閉
		$(this).next().slideToggle(300);
	});

/*
	$("[name=date_from]").on("change", function () {
		var date_from = $('[name=date_from]').val();
		var date_to = $('[name=date_to]').val();
		var w_dt = new Date(date_from);
		w_dt.setFullYear(w_dt.getFullYear(w_dt)+1);
		w_dt.setDate(w_dt.getDate(w_dt)-1);
		$('[name=date_to]').val(dateFormat(w_dt.getFullYear(), (w_dt.getMonth()+1), w_dt.getDate()));
	});
*/

	$("[name=date_from], [name=date_to]").on("change", function () {
		chart2();
	});

	chart1();
	chart2();
	chart_sales();
	chart_sales_result();
	chart_customer_sales();
	chart_substcar();
}

// 顧客別売上
const chart_customer_sales = function(){
    var ctx = $('#chart_customer_sales');

	var param = {md: 'load_customer_sales'};
	$.post('./', param, function(res){
		if (res.status) {
			var company_list = res.company;
			var amount_list = res.amount;
			var amount_p1_list = res.amount_p1;
			var count_list = res.count;
			var myChartSt = new Chart(ctx,{
				type: "bar",    //barで縦グラフ
			    data: {
			        labels:  company_list,
//			        labels:  ['2022/08','2022/09','2022/10','2022/11','2022/12'],
			        datasets: [
			        	{
						    type: 'line',           //折れ線グラフを適用
						    label: "１件あたり",
						    fill: false,            //エリア塗りつぶし設定
						    data: amount_p1_list,     //棒グラフの合計値
							yAxisID: "y-axis-2",
				            order: 0,
//				            hidden: true,
						},
			        	{
			                label: '売上',
			                data: amount_list,
							yAxisID: "y-axis-1",
				            order: 1,
			            },
			        ]
			    },
			    options: {
					animation: false,
			        responsive: true,          //グラフ自動設定
			        maintainAspectRatio: false,
			        title: {
			         	display: true,
			           	text: '過去１年',        //グラフの見出し
			           	padding: 2,
			           	fontSize: 14,
			        },
			        scales: {
			            xAxes: [{
			                stacked: true,              //積み上げ棒グラフの設定
			                barPercentage: 0.9,           //棒グラフ幅
			          		categoryPercentage:0.8,
			                scaleLabel: {            // 軸ラベル
			                    labelString: '月',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            }],
			            yAxes: [{
				            id: "y-axis-1",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "left", // どちら側に表示される軸か？
			                stacked: false,               //積み上げ棒グラフにする設定
			                ticks: {                      //最大値最小値設定
			                    stepSize: 5000000,        //軸間隔
			                    callback: function(label, index, labels) { /* ここです */
                                    return (label/1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ;
                                }
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "金額（千円）",
			                }
			            },{
				            id: "y-axis-2",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "right", // どちら側に表示される軸か？
			                stacked: true,               //積み上げ棒グラフにする設定
			                ticks: {                      //最大値最小値設定
			                    stepSize: 100000,        //軸間隔
			                    callback: function(label, index, labels) { /* ここです */
                                    return (label/1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ;
                                }
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "／件（千円）",
			                }
			            }],
			        },
			        legend: {             // 凡例の設定
				       position: "left",     // 表示位置
				       labels: {              // 凡例文字列の設定
				          fontSize: 11,
						  boxWidth: 20,
//				          usePointStyle: true,
				       },
				    },
			        layout: {                             //レイアウト
			            padding: {                          //余白設定
			                left: 10,
			                right: 10,
			                top: -2,
			                bottom: -5,
			            }
			        },
			        plugins: {
			            colorschemes: {
			                scheme: 'brewer.Accent8',
			                fillAlpha: 0.2
			            },
				        datalabels: {
							display: false
				        },
			        },
			        tooltips: {
	                    callbacks: {
	                        label: function(tooltipItem, data){
	                            // グループ名
	                            var groupName = data.datasets[tooltipItem.datasetIndex].label;
	                            // X 軸ラベル
//	                            var xAxesLabel = options.scales.xAxes[0].scaleLabel.labelString;
	                            // 件数
	                            var count = count_list[tooltipItem.index];

	                            return ` ${groupName} : ${tooltipItem.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} | 件数 : ${count}`;
	                        }
	                    }
			        }
			    },
//				plugins: [
//					ChartDataLabels,
//				],
			});
		} else {
			return;
		}
	}, 'json');

}

// 個人・法人別件数
const chart1 = function(){
    var ctx = $('#chart');

	var param = {md: 'load_chart_list'};
	$.post('./', param, function(res){
		if (res.status) {
			var ym_list = res.ym;
			var person_list = res.person;
			var company_list = res.company;
			var rate_list = res.rate;
			var myChartSt = new Chart(ctx,{
				type: "bar",      //barで縦グラフ
			    data: {
			        labels:  ym_list,
			        datasets: [
			        	{
						    type: 'line',           //折れ線グラフを適用
						    label: "個人比率",
						    fill: false,            //エリア塗りつぶし設定
						    data: rate_list,     //棒グラフの合計値
							yAxisID: "y-axis-2",
				            order: 0,
						},
			        	{
			                label: '個人',
			                data: person_list,
							yAxisID: "y-axis-1",
				            order: 1,
			            },
			            {
			                label: '法人',
			                data: company_list,
							yAxisID: "y-axis-1",
				            order: 2,
			            },
			        ]
			    },
			    options: {
					animation: false,
			        responsive: true,                  //グラフ自動設定
			        maintainAspectRatio: false,
			        title: {
			         	display: true,
			           	text: '過去３年',        //グラフの見出し
			           	padding: 2,
			           	fontSize: 14,
			        },
			        scales: {
			            xAxes: [{
			                stacked: true,              //積み上げ棒グラフの設定
			          		categoryPercentage:0.4,
			                scaleLabel: {            // 軸ラベル
			                    labelString: '月',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            }],
			            yAxes: [{
				            id: "y-axis-1",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "left", // どちら側に表示される軸か？
			                stacked: true,               //積み上げ棒グラフにする設定
			                ticks: {                      //最大値最小値設定
			                    stepSize: 10,               //軸間隔
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "件数",
			                }
			            },{
				            id: "y-axis-2",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "right", // どちら側に表示される軸か？
			                stacked: true,               //積み上げ棒グラフにする設定
			                ticks: {                      //最大値最小値設定
			                    max: 60,                  //最大値
			                    stepSize: 10,               //軸間隔
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "比率（％）",
			                }
			            }],
			        },
			        legend: {             // 凡例の設定
				       position: "left",     // 表示位置
				       labels: {              // 凡例文字列の設定
				          fontSize: 11,
						  boxWidth: 20,
				       },
				    },
			        layout: {                             //レイアウト
			            padding: {                          //余白設定
			                left: 10,
			                right: 10,
			                top: -2,
			                bottom: -5,
			            }
			        },
			        plugins: {
			            colorschemes: {
			                scheme: 'brewer.Accent4',
			                fillAlpha: 0.2
			            },
				        datalabels: {
							display: false
						}
			        },
			        tooltips: {
			            mode: "label"
			        },
			    }
			});
		} else {
			return;
		}
	}, 'json');

}

// 営業成績
const chart_sales_result = function(){
    var ctx = $('#chart_sales_result');

	var param = {md: 'load_sales_result'};
	$.post('./', param, function(res){
		if (res.status) {
			var ym_list = res.ym;
			var data_list = res.data;
			var myChartSt = new Chart(ctx,{
				type: "bar",      //barで縦グラフ
			    data: {
			        labels:  ym_list,
			        datasets: data_list,
			    },
			    options: {
					animation: false,
			        responsive: true,          //グラフ自動設定
			        maintainAspectRatio: false,
			        title: {
			         	display: true,
			           	text: '過去１年',        //グラフの見出し
			           	padding: 2,
			           	fontSize: 14,
			        },
			        scales: {
			            xAxes: [{
			                stacked: false,              //積み上げ棒グラフの設定
			                barPercentage: 0.9,           //棒グラフ幅
			          		categoryPercentage:0.8,
			                scaleLabel: {            // 軸ラベル
			                    labelString: '月',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            }],
			            yAxes: [{
				            id: "y-axis-1",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "left", // どちら側に表示される軸か？
			                stacked: false,               //積み上げ棒グラフにする設定
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "件数",
			                }
			            }],
			        },
			        legend: {             // 凡例の設定
				       position: "left",     // 表示位置
				       labels: {              // 凡例文字列の設定
				          fontSize: 11,
						  boxWidth: 20,
//				          usePointStyle: true,
				       },
				    },
			        layout: {                             //レイアウト
			            padding: {                          //余白設定
			                left: 10,
			                right: 10,
			                top: -2,
			                bottom: -5,
			            }
			        },
			        plugins: {
			            colorschemes: {
			                scheme: 'brewer.Accent8',
			                fillAlpha: 0.2
			            },
				        datalabels: {
							display: false
				        },
			        },
			        tooltips: {
	                    callbacks: {
	                        label: function(tooltipItem, data){
	                            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	                        }
	                    }
			        }
			    },
//				plugins: [
//					ChartDataLabels,
//				],
			});
		} else {
			return;
		}
	}, 'json');

}

// 売上
const chart_sales = function(){
    var ctx = $('#chart_sales');

	var param = {md: 'load_sales'};
	$.post('./', param, function(res){
		if (res.status) {
			var ym_list = res.ym;
			var amount = res.amount;
			var storing = res.storing;
			var delivered = res.delivered;
//			var rate_list = res.rate;
			var myChartSt = new Chart(ctx,{
				type: "bar",      //barで縦グラフ
			    data: {
			        labels:  ym_list,
			        datasets: [
			        	{
			        		type: "line",
			                label: '売上',
			                data: amount,
							yAxisID: "y-axis-1",
				            order: 0,
			            },
			        	{
			                label: '入庫',
			                data: storing,
			                datalabels: {
			                	display: true,
			                    align: 'end', // データラベルの位置（'start' は下側）
			                },
							yAxisID: "y-axis-2",
				            order: 1,
			            },
			            {
			                label: '出庫',
			                data: delivered,
			                datalabels: {
			                	display: true,
			                    align: 'start', // データラベルの位置（'start' は下側）
			                },
							yAxisID: "y-axis-2",
				            order: 1,
			            },
			        ]
			    },
			    options: {
					animation: false,
			        responsive: true,                  //グラフ自動設定
			        maintainAspectRatio: false,
			        title: {
			         	display: true,
			           	text: '過去3年',        //グラフの見出し
			           	padding: 2,
			           	fontSize: 14,
			        },
			        scales: {
			            xAxes: [{
			                stacked: false,              //積み上げ棒グラフの設定
		//	                barPercentage: 0.4,           //棒グラフ幅
			          		categoryPercentage:0.4,
			                scaleLabel: {            // 軸ラベル
			                    labelString: '月',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            }],
			            yAxes: [{
				            id: "y-axis-1",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "left", // どちら側に表示される軸か？
			                stacked: false,               //積み上げ棒グラフにする設定
			                ticks: {                      //最大値最小値設定
		//	                    max: 30,                  //最大値
			                    stepSize: 1000000,        //軸間隔
			                    callback: function(label, index, labels) { /* ここです */
                                    return (label/1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ;
                                }
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "金額（千円）",
			                }
			            },
			            {
				            id: "y-axis-2",   // Y軸のID
				            type: "linear",   // linear固定
				            position: "right", // どちら側に表示される軸か？
			                stacked: false,               //積み上げ棒グラフにする設定
			                ticks: {                      //最大値最小値設定
			                    max: 120,                  //最大値
			                    stepSize: 10,               //軸間隔
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                	labelString: "台",
			                }
			            },
			            ]
			        },
			        legend: {             // 凡例の設定
				       position: "left",     // 表示位置
				       labels: {              // 凡例文字列の設定
				          fontSize: 11,
						  boxWidth: 20,
//				          usePointStyle: true,
				       },
				    },
			        layout: {                             //レイアウト
			            padding: {                          //余白設定
			                left: 10,
			                right: 10,
			                top: -2,
			                bottom: -5,
			            }
			        },
			        plugins: {
			            colorschemes: {
			                scheme: 'brewer.Accent4',
			                fillAlpha: 0.2
			            },
				        datalabels: {
							display: false
				        }
			        },
			        tooltips: {
	                    callbacks: {
	                        label: function(tooltipItem, data){
	                            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	                        }
	                    }
			        }
			    }
			});
		} else {
			return;
		}
	}, 'json');

}

// 代車稼働状況
const chart_substcar = function(){
    var ctx = $('#chart_substcar');

	var param = {md: 'load_substcar'};
	$.post('./', param, function(res){
		if (res.status) {
			var labels = res.data.msc_name;
			var use_days = res.data.use_days;
			var use_rate = res.data.use_rate;
			var use_rate_all = res.data.use_rate_all;
			var myChartSt = new Chart(ctx,{
				type: "horizontalBar",      // 横棒グラフ
			    data: {
			        labels:  labels,
			        datasets: [
				        {
				            label: '稼働率',
			                data: use_rate,
			                barPercentage: 1.8,
			                categoryPercentage: 0.9,
			                xAxisID: "x-axis-1",
				        },
				        {
				            label: '延べ日数',
			                data: use_days,
//						    type: 'line',           //折れ線グラフを適用
//			                xAxisID: "x-axis-2",
//		                	hidden: true,
		                	showLine:false,
		                	barThickness: 0,
				        },
			        ]
			    },
			    options: {
					animation: false,
			        responsive: true,                  //グラフ自動設定
					maintainAspectRatio: false,
			        scales: {
			            xAxes: [
			            {
				            id: "x-axis-1",   // 軸のID
				            type: "linear",   // linear固定
				            position: "top", // どちら側に表示される軸か？
			                ticks: {                      //最大値最小値設定
			                    max: 100,                  //最大値
			                    stepSize: 10,               //軸間隔
			                },
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                    labelString: '稼働率％',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            },
/*
			            {
				            id: "x-axis-2",   // 軸のID
			                scaleLabel: {            // 軸ラベル
			                	display: true,
			                    labelString: '日数',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            }
*/
			            ],
			            yAxes: [{
			                scaleLabel: {            // 軸ラベル
			                	display: false,
			                    labelString: '車両',  // ラベル
			                    fontSize: 10,         // フォントサイズ
			                },
			            }],
			        },
			        title: {
			         	display: true,
			           	text: '過去１年間 (全体：' + use_rate_all + '%)',        //グラフの見出し
			           	padding: 2,
			           	fontSize: 14,
			        },
			        legend: {             // 凡例の設定
//						position: "left",     // 表示位置
						display: false
				    },
			        plugins: {
			            datalabels: {
//							display: false
			                formatter: (value, ctx) => {
			               		if(ctx.datasetIndex == 0){
			               			return value + '%';
			               		} else {
			               			return null;
			               		}
//						      let label = ctx.chart.data.labels[ctx.dataIndex];
//							  return label;
			                },
			            },
			        },
			        tooltips: {
//			            enabled: false
			            mode: "label",
						position: "nearest",
/*
	                    callbacks: {
	                        label: function(tooltipItem, data){
			               		if(tooltipItem.datasetIndex == 1){
//			               			return false;
	                            } else {
//		                            return data.datasets[1].label + ":" + ;
	                            }
	                        }
	                    }
*/
			        }
			    }
			});
		} else {
			return;
		}
	}, 'json');

}

// 修理種別割合
const chart2 = function(){
    var date_from = $('[name=date_from]').val();
    var date_to = $('[name=date_to]').val();
    var w_dt = new Date(date_from);
    w_dt.setFullYear(w_dt.getFullYear(w_dt)-1);
    var date_from_l = dateFormat(w_dt.getFullYear(), (w_dt.getMonth()+1), w_dt.getDate());
    w_dt = new Date(date_to);
    w_dt.setFullYear(w_dt.getFullYear(w_dt)-1);
    var date_to_l = dateFormat(w_dt.getFullYear(), (w_dt.getMonth()+1), w_dt.getDate());

    var a_chart =[
    	{id:1, date_from:date_from, date_to:date_to, period_day:'storing'},
    	{id:2, date_from:date_from, date_to:date_to, period_day:'delivered'},
    	{id:3, date_from:date_from_l, date_to:date_to_l, period_day:'storing'},
    	{id:4, date_from:date_from_l, date_to:date_to_l, period_day:'delivered'}
    ]

    a_chart.forEach(function (chart, key) {
		var param = {md:'load_chart2_list', date_from:chart["date_from"], date_to:chart["date_to"], period_day:chart["period_day"]};
	    var ctx = $('#chart_type_ratio_'+chart["id"]);
		$.post('./', param, function(res){
			if (res.status) {
				var labels = res.data.wdc_type_jp;
				var count_list = res.data.count;
				var total = res.data.total;
				var myChartPie = new Chart(ctx,{
					layout:{padding: 20},
					type: "pie",      //barで縦グラフ
				    data: {
				        labels:  labels,
				        datasets: [{
			                data: count_list
				        }]
				    },
				    options: {
						animation: false,
				        responsive: false,                  //グラフ自動設定
				        title: {
				         	display: true,
				         	text: (chart["period_day"]=='storing'? '入庫':'出庫') + '　' + chart["date_from"] + '～' + chart["date_to"],
				           	padding: 20,
//				           	fontSize: 13,
				        },
				        legend: {             // 凡例の設定
				        	position: "left",  // 表示位置
							display: (chart["id"] % 2 == 0) ? false:true,  // 凡例表示
						},
						tooltips: {enabled: false},
						hover: {mode: null},
						plugins: {
				            datalabels: {
				                color: '#000',
								align: "end",
	//							anchor: "end",
						        offset: 30,
								font: {
				                    size: 12,
				                },
				                formatter: (value, ctx) => {
							      let label = ctx.chart.data.labels[ctx.dataIndex];
	    						  return label + '\n' + Math.round(value*100/total) + '%';
				                },
				            },
				        },
				        tooltips: {
				            enabled: false
				        }
				    }
				});
			} else {
				return;
			}
		}, 'json');
    });

}

// 日付 0埋め
const dateFormat = function(year,month,day){
	return year + '-' + ('0'+month).slice(-2) + '-' + ('0'+day).slice(-2);
}

$(document).ready(chart.init);

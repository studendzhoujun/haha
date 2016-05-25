/**
 * @author houjiawei
 * @date    2016-02-22 11:33:46
 *  <script src="__PUBLIC__/js/lithe.js"
 data-config="config.js"
 data-debug="true"
 data-main="conf/dataAnalysis/dataAnalysis.js">
 </script>
 */
define('conf/dataAnalysis/dataAnalysis.js', function(require) {

  require('$');
  require('utils/calendar.js');
  require('vendors/echarts-all.js');
  require('utils/appInterface.js');
  require('mods/tokenCheck.js');
  var Ajax = require('utils/ajax.js');
  var common = require('lib/common.js');
  var shopId = common.getParams().shopId;
  var FastClick = require('vendors/fastclick.js');
  FastClick.attach(document.body);

  var myChart = window.echarts.init(document.getElementById('data-chartbox'));
  var __tempDateArr = [];
  var mappingObj = {
    't7_visitor_num': {
      text: '7天共计访问人数'
    },
    't7_order_num': {
      text: '7天共计订单数'
    },
    't7_brokerage': {
      text: '7天共计获得佣金'
    },
    't30_visitor_num': {
      text: '30天共计访问人数'
    },
    't30_order_num': {
      text: '30天共计订单数'
    },
    't30_brokerage': {
      text: '30天共计获得佣金'
    },
    'visitor_num': {
      text: '访问人数'
    },
    'order_num': {
      text: '订单数'
    },
    'brokerage': {
      text: '获得佣金'
    }
  };

  fetchData();

  myChart.on('click', function(params) {
    renderRight(params.name, params.data);
  });
  var nameNow = '访客';
  $(".mshop-data-chartul li").on('click', function() {
     nameNow = this.innerHTML;     
    $(".mshop-data-chartul li").eq($(this).index()).addClass("mshop-data-chartul-cur").siblings().removeClass('mshop-data-chartul-cur');
    fetchData();

  });
  $('#recentBox input').on('click', function() {
    $("#recentBox input").eq($(this).index()).addClass("mshop-data-btncur").siblings().removeClass('mshop-data-btncur');
    fetchData();
  });

  function fetchData() {

    var date = $('#recentBox>input.mshop-data-btncur').attr('data-val');
    var module = $('#indexbox>li.mshop-data-chartul-cur').attr('data-val');
    Ajax.query('/analysis/tendency', {
      type: date,
      module: module,
      shopId: shopId
    }, function(data) {
      if (data.code !== 200) {
        window.AppInterface.toast(data.message);
        return;
      }
      data = data.data;
      var itemList = [];
      var totalnum = 0;
      if (data[module]) {
        itemList = data[module].list;
        totalnum = data[module].total_num;
      }
      var dataArr = [],
        dateArr = [];
      __tempDateArr = [];
      for (var key in itemList) {
        if (itemList.hasOwnProperty(key)) {
          dataArr.push(itemList[key]);
          var formatVal = window.Calendar.getInstance(key).format(date === 't7' ? 'M.d' : 'M.d');
          dateArr.push(formatVal);
          __tempDateArr.push({
            origin: key,
            module: module,
            week: window.Calendar.getInstance(key).format('EE'),
            month: window.Calendar.getInstance(key).format('M.d')
          });
        }
      }
      renderRight(dateArr[dateArr.length - 1], dataArr[dataArr.length - 1]);
      $('#totalDataName').html(mappingObj[date + '_' + module].text);
      $('#totalDataNum').html(totalnum);
      renderCharts(dataArr, dateArr);
    });
  }

  function renderRight(name, data) {
    var text;
    for (var i = 0; i < __tempDateArr.length; i++) {
      if (name === __tempDateArr[i].week || name === __tempDateArr[i].month) {
        text = (__tempDateArr[i].month+'').replace(/^(\d{1,2})\.(\d{1,2})$/g,'$1月$2日') + mappingObj[__tempDateArr[i].module].text;
        break;
      }
    }
    $('#singleDataName').html(text);
    $('#singleDataNum').html(data);
  }


  function renderCharts(dataArr, dateArr) {
    var option = {
              noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
              },             
              backgroundColor:'#f9f9f9',                  
                tooltip : {
                  trigger: 'axis',
                  show:true,
                  showContent:true, 
                  triggerOn:'mousemove',  
                  // formatter:function(data){
                  //   renderRight(data[0].seriesName, data[0].data);                                      
                  //   return (data[0].name+'')+'<br>'+data[0].seriesName+':'+data[0].data;
                  // },                                                     
                  axisPointer:{
                              type: 'line',
                              lineStyle: {//浮线样式
                                  color: 'pink',  
                                  width: 1,
                                  type: 'solid'
                              }
                            },
                  textStyle:{
                    fontSize:0,
                    color:'#ee2f2f'                    
                  },                  
                  backgroundColor:'rgba(1,1,1,0.1)',                  
                },        
                grid: {
                    left: '2%',
                    right: '6%',
                    bottom: '3%',
                    containLabel: true
                //borderColor:'#37465D'
                },        
                xAxis : [
                    { 
                      //修改坐标轴线的宽度 颜色
                              axisLine:{
                                lineStyle:{
                                  color:'#d1d1d1',
                                  width:1
                                }
                              }, 
                              //修改坐标轴线上数据的颜色大小
                                axisLabel : {
                                  show : true,
                                  textStyle : {
                                  color : '#999',
                                  align : 'center',
                                  fontSize: 10
                                  }
                                },
                                axisTick:{
                                  lineStyle:{
                                    color:'#999',
                                    width:0
                                  }
                                },                                                         
                     splitLine:{show:false},
                       type : 'category',
                       boundaryGap : false,
                       data : dateArr,
                       boundaryGap : false//留白
                    }
                ],
                yAxis : [
                    { 
                      axisLine:{
                                lineStyle:{
                                    color:'#f4f4f4',
                                    width:1
                                  }
                                }, 
                        type : 'value',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        splitLine : {show:false},
                        //修改坐标轴线上数据的颜色大小
                                axisLabel : {
                                  show : false,
                                  textStyle : {
                                  color : '#000',
                                  align : 'center'
                                  }
                                },
                                axisTick:{
                                  lineStyle:{
                                    color:'#999',
                                    width:0
                                  }
                                },
                    }
                ],        
                series : [           
                    {
                        name:nameNow,
                        type:'line',
                        stack: '',
                        data:dataArr,
                        itemStyle:{
                          normal:{
                            lineStyle:{
                              color:'#ee2f2f',
                              width:1
                            }
                          } 
                        },                        
                    }
                ],
                //symbolList:[{show:'false'}]//图例
    };
    myChart.setOption(option,true);
  }

});

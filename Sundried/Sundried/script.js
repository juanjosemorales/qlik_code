// this is the function which manages the single page application navigation (Dashboard / Analysis)
function changePage(pageId){
  var dashPage = document.getElementById('dashPage');
  var analysisPage = document.getElementById('analysisPage');
  if(pageId === "Dashboard"){
    dashPage.style.display = "block";
    analysisPage.style.display = "none";
  }
  else{
    dashPage.style.display = "none";
    analysisPage.style.display = "block";
  }
}

var config = {
  schema: schema,
  url: "ws://localhost:4848/app"
}
// creates our session for Engima //
var session = enigma.create(config);
//Opens the enigma session and returns a value which is our globalClass
// - GLOBAL CLASS on the Qlik Sense Developer Site --- (https://help.qlik.com/en-US/sense-developer/June2017/Subsystems/EngineAPI/Content/Classes/GlobalClass/Global-class.htm)

session.open().then(function(globalClass){
  console.log("THE BELOW OBJECT IS THE GLOBAL CLASS");
  console.log(globalClass)
  //opens our WBY Sales Qlik Sense Data set and returns a value which is our appClass
  // - APP CLASS on the Qlik Sense Developer Site --- (https://help.qlik.com/en-US/sense-developer/June2017/Subsystems/EngineAPI/Content/Classes/AppClass/App-class.htm)
  globalClass.openDoc("WBY Sales.qvf").then(function(appClass){
    console.log("THE BELOW OBJECT IS THE APP CLASS");
    console.log(appClass);
    //This function 'getTablesAndKeys()' was requested as it provides an overview of the underlying table strcuture and the associated keys
    appClass.getTablesAndKeys({"qcx": 1000,"qcy": 1000},
                              {"qcx": 0,"qcy": 0},
                              30,
                              true,
                              false).then(function(data){
                                console.log("THE BELOW OBJECT IS THE RETURNED VALUES FROM THE getTablesAndKeys() method");
                                console.log(data);
                              })

    var listDef1 = {
      qInfo:{
        qType: "listbox1"
      },
      qListObjectDef: {
        qDef: {
          qFieldDefs: ["CategoryName"]
        },
        qInitialDataFetch: [{
          qTop: 0,
          qLeft: 0,
          qWidth: 1,
          qHeight: 22
        }]
      }
    }

    var listDef2 = {
      qInfo:{
        qType: "listbox1"
      },
      qListObjectDef: {
        qDef: {
          qFieldDefs: ["Year"]
        },
        qInitialDataFetch: [{
          qTop: 0,
          qLeft: 0,
          qWidth: 1,
          qHeight: 10
        }]
      }
    }

    var hyperDef1 = {
      qInfo: {
        qType: "hyperDef1"
      },
      qHyperCubeDef: {
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ["Country"]
            }
          }
        ],
        qMeasures: [
          {
            qDef: {
              qDef: "=Sum(OrderLineAmount)"
            },
            qSortBy: {
              qSortByNumeric: -1
            }
          }
        ],
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 2,
            qHeight: 30
          }
        ],
        qInterColumnSortOrder: [1,0]
      }
    }

    var hyperDef2 = {
      qInfo: {
        qType: "hyperDef2"
      },
      qHyperCubeDef: {
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ["City"]
            }
          }
        ],
        qMeasures: [
          {
            qDef: {
              qDef: "=Sum(OrderLineAmount)"
            }
          }
        ],
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 2,
            qHeight: 30
          }
        ]
      }
    }

    var kpiDef1 = {
      qInfo: {
        qType: "my Kpi"
      },
      myKpiValue: {
        qStringExpression: "=Sum(OrderLineAmount)"
      },
      myKpiMsg: "Total Revenue"
    }

    var kpiDef2 = {
        qInfo: {
          qType: "my Kpi2"
        },
        myKpiValue: {
          qStringExpression: "=Count(ProductID)"
        },
        myKpiMsg: "Total Products"
      }

      var currentDef = {
        qInfo: {
          qType: "my Selections"
        },
        qSelectionObjectDef: {}
      }



    appClass.createSessionObject(kpiDef1).then(function(model){
      model.addListener('changed', function(){
        renderKpi(model, 'dashKpi1')
      })
      renderKpi(model, 'dashKpi1')
    })

    appClass.createSessionObject(kpiDef2).then(function(model){
      model.addListener('changed', function(){
        renderKpi(model, 'dashKpi2')
      })
      renderKpi(model, 'dashKpi2')
    })

    appClass.createSessionObject(hyperDef1).then(function(model){
      model.addListener('changed', function(){
        renderPieChart(model, 'analysisPie1')
      })
      renderPieChart(model, 'analysisPie1')
    })

    appClass.createSessionObject(hyperDef2).then(function(model){
      model.addListener('changed', function(){
        renderPieChart(model, 'analysisPie2')
      })
      renderPieChart(model, 'analysisPie2')
    })


    appClass.createSessionObject(hyperDef1).then(function(model){
      model.addListener('changed', function(){
        renderBarChart(model, 'dashChart1')
      })
      renderBarChart(model, 'dashChart1')
    })

    appClass.createSessionObject(hyperDef2).then(function(model){
      model.addListener('changed', function(){
        renderPieChart(model, 'dashChart2')
      })
      renderPieChart(model, 'dashChart2')
    })

    appClass.createSessionObject(hyperDef1).then(function(model){
      model.addListener('changed', function(){
        renderBarChart(model, 'analysisChart1')
      })
      renderBarChart(model, 'analysisChart1')
    })

    appClass.createSessionObject(listDef1).then(function(model){
      window.listDef1Model = model;
      model.addListener('changed', function(){
        renderListBox(model, 'dashList1', 'listDef1Model')
      })
      renderListBox(model, 'dashList1', 'listDef1Model')
    })

    appClass.createSessionObject(listDef2).then(function(model){
      window.listDef2Model = model;
      model.addListener('changed', function(){
        renderListBox(model, 'dashList2', 'listDef2Model')
      })
      renderListBox(model, 'dashList2', 'listDef2Model')
    })

    appClass.createSessionObject(currentDef).then(function(model){
      model.addListener('changed', function(){
        renderCurrentSelections(model, "currentSelections")
      })
      renderCurrentSelections(model, "currentSelections")
    })

  })
})

function renderKpi(model, elemId){
  model.getLayout().then(function(layout){
    var html = "<h2 align='center' style='color:blue; font-size: 150%'>" + layout.myKpiMsg + "</h2>";
        html += "<h1 align='center' style='color:blue; font-size: 400%'>" + layout.myKpiValue + "</h1>";
    document.getElementById(elemId).innerHTML = html;
  })
}

function renderBarChart(model, elemId){
  model.getLayout().then(function(layout){
    var matrix = layout.qHyperCube.qDataPages[0].qMatrix;
    var amData = [];
    for (var i = 0; i < matrix.length; i++) {
      amData.push({
        dim: matrix[i][0].qText,
        exp: matrix[i][1].qText,
        elemNumber: matrix[i][0].qElemNumber
      })
    }
    AmCharts.makeChart(elemId, {
      type: "serial",
      categoryField: "dim",
      dataProvider: amData,
      listeners: [{
        event: "clickGraphItem",
        method: function(vis){
          var eN = vis.item.dataContext.elemNumber;
          model.selectHyperCubeValues("/qHyperCubeDef", 0, [eN], true)
        }
      }],
      graphs: [{
        fillAlphas: 1,
        type: "column",
        valueField: "exp"
      }]
    })
  })
}

function renderPieChart(model, elemId){
  model.getLayout().then(function(layout){
    var matrix = layout.qHyperCube.qDataPages[0].qMatrix;
    var amData = [];
    for (var i = 0; i < matrix.length; i++) {
      amData.push({
        dim: matrix[i][0].qText,
        exp: matrix[i][1].qText,
        elemNumber: matrix[i][0].qElemNumber
      })
    }
    AmCharts.makeChart(elemId, {
      type: "pie",
      valueAxes: [{
        axisAlpha: 1
      }],
      radius: "42%",
      innerRadius: "60%",
      titleField: "dim",
      dataProvider: amData,
      valueField: "exp",
      labelText: "[[dim]]",
      listeners: [{
        event: "clickSlice",
        method: function(vis){
          var elemNumber = vis.dataItem.dataContext.elemNumber;
          model.selectHyperCubeValues("/qHyperCubeDef", 0, [elemNumber], true)
        }
      }]
    })
  })
}

function renderListBox(model, elemId, modelName){
  model.getLayout().then(function(layout){
    var listData = layout.qListObject.qDataPages[0].qMatrix;
    var html = "<ul>";
    listData.forEach(function(row){
      html +=
    "<li onclick='makeListboxSelection("+row[0].qElemNumber+", "+modelName+")' class='state-"+row[0].qState+"'>" + row[0].qText + "</li>"
    })
    html += "</ul>"
    document.getElementById(elemId).innerHTML = html;
  })
}

function makeListboxSelection(elemNumber, modelName){
  modelName.selectListObjectValues("/qListObjectDef", [elemNumber], true)
}

function renderCurrentSelections(model, elemId){
  model.getLayout().then(function(layout){
    var selectionList = layout.qSelectionObject.qSelections;
    if (selectionList.length > 0) {
      var html = "";
      for (var i = 0; i < selectionList.length; i++) {
        var selectionValues = selectionList[i].qSelected;
        selectionValues = selectionValues.split(",");
        selectionValues.forEach(function(row){
          html += "<span>" + row + "  </span>";
        })
      }
      document.getElementById(elemId).innerHTML = html;
    }
    else{
      document.getElementById(elemId).innerHTML = "";
    }
  })
}

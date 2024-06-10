class TabGnss
{  

  Title = "GNSS";
  #map = null;

  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["GNSS"])], Tabs.GetDiv());
    this.isGnssPowered = null;
    this.#map = {
      key: "AkbDWYSRSMpeYuIJEI0dlS--dPnYpbeqUwjLR_fHg9sQY_nJOY3xcMzr606J0Pvv",
      script : null,
      div : null,
      map : null
    };
    
    setTimeout(()=>{
      this.Init();
      
      window.addEventListener("serial", (data)=>{
        if(data.detail.cmd?.GetCmd() == "AT+CGNSPWR")
        {
          if(data.detail.cmd.GetRequestType() == "read")
          {
            this.isGnssPowered = AT_CGNSPWR.IsPowered();
          }
          if(this.#map.script == null)
          {
            this.#GenerateMap();
          }
        }
        else if(data.detail.cmd?.GetCmd() == "AT+CGNSINF")
        {
          if(this.isGnssPowered && data.detail.cmd.GetRequestType() == "exe")
          {
            this.#GenerateMap(AT_CGNSINF.GetLatitude(), AT_CGNSINF.GetLongitude(), AT_CGNSINF.GetAccuracy());
            console.log(this.#map.map.layers);
          }
        }
      });
    }, 200);
  }
  
  Init()
  {
    //this.div.appendChild(Settings.GetGroupDiv("apn"));
    //this.div.appendChild(Settings.GetGroupDiv("ssl"));
    
    this.div.appendChild(
      Tabs.AddCmd(
        "GET Power Mode", 
        ()=>{
          AT_CGNSPWR.Read().then(()=>{});
        },
        AT_CGNSPWR)
    );

    _CN("br", {}, [], this.div);

    _CN("button", {style:"margin:1vh;"}, ["POWER ON GNSS"], this.div).addEventListener("click", ()=>{
      AT_CGNSPWR.Write([1]);
    });

    _CN("button", {style:"margin:1vh;"}, ["POWER OFF GNSS"], this.div).addEventListener("click", ()=>{
      AT_CGNSPWR.Write([0]);
    });

    _CN("br", {}, [], this.div);

    _CN("button", {style:"margin:1vh;"}, ["GET GNSS INFO"], this.div).addEventListener("click", ()=>{
      AT_CGNSINF.Execute();
    });

  }
  
  Select()
  {
    if(this.isGnssPowered == null)
    {
      AT_CGNSPWR.Read();
    }
  }

  #GenerateMap(lat, long, acc)
  {
    if(this.#map.script == null)
    {
      const bingKey = this.#map.key;
      this.#map.div = _CN("div", {id:"myMap", style:"position:relative;width:100%;height:30vh;background-color:gray;"}, [], this.div);
      this.#map.script = _CN("script", {src:`https://www.bing.com/api/maps/mapcontrol?key=${bingKey}`}, [], document.body);
      return;
    }

    let center = new Microsoft.Maps.Location(lat, long);
    let zoom = 11;
    if(acc < 1000) zoom++;
    if(acc < 500) zoom++;
    if(acc < 100) zoom++;
    if(acc < 50) zoom++;

    this.#map.map = new Microsoft.Maps.Map(this.#map.div, {
      center: center,
      zoom: zoom
    });

    Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialMath', 'Microsoft.Maps.Contour'], () => {
      this.#GenerateCircle(center, acc);
    });
  }

  #GenerateCircle(center, accuracy)
  {
    var locs = Microsoft.Maps.SpatialMath.getRegularPolygon(center, accuracy, 36, Microsoft.Maps.SpatialMath.DistanceUnits.Meters);
    let circle1 =  new Microsoft.Maps.ContourLine(locs, 'rgba(0,0,150,0.5)');

    var layer = new Microsoft.Maps.ContourLayer([circle1], {
        colorCallback: function (val) {
            return val;
        },
        polygonOptions: {
            strokeThickness: 0
        }
    });
    
    var pushpin = new Microsoft.Maps.Pushpin(center, { title: "+/- " + accuracy + ' meters' });
    layer.add(pushpin);

    this.#map.map.layers.insert(layer);
  }
  
  
  #Error(msg, e, o = {})
  {
    console.error("GNSS ERROR", e);
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
    
  }
  
}

Tabs.AddTab(new TabGnss());
let AT_CPSI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      test: true,
      description: "Inquiring UE System Information",
      example: "+CPSI: LTE NB-IOT,Online,460-11,0x5AE1,187212754,82, EUTRAN-BAND5,2506,0,0,-7,-115,-110,13",
      cmd: "AT+CPSI",
      doc: "5.2.19"
    }); //true, false, false, true, "Inquiring UE System Information", "+CPSI: LTE NB-IOT,Online,460-11,0x5AE1,187212754,82, EUTRAN-BAND5,2506,0,0,-7,-115,-110,13", "AT+CPSI", 1000);
    
    let enumSMode = [];
    enumSMode.push(new ATEnum("no service", "NO SERVICE"));
    enumSMode.push(new ATEnum("gsm", "GSM"));
    enumSMode.push(new ATEnum("lte cat-m1", "LTE CAT-M1"));
    enumSMode.push(new ATEnum("lte nb-iot", "LTE NB-IOT"));
    
    let enumOMode = [];
    enumOMode.push(new ATEnum("online", "Online"));
    enumOMode.push(new ATEnum("offline", "Offline"));
    enumOMode.push(new ATEnum("factory test mode", "Factory Test Mode"));
    enumOMode.push(new ATEnum("reset", "Reset"));
    enumOMode.push(new ATEnum("low power mode", "Low Power Mode"));
    
    this.AddParam("systemmode", enumSMode, "system mode");
    this.AddParam("operationmode", enumOMode, "UE operation mode");
    this.AddParam("mccmnc", "string", "MCC-MNC");
    
    // If LTE
    this.AddParam("tac", "string", "Tracing Area Code");
    this.AddParam("scellid", "string", "Serving Cell ID");
    this.AddParam("pcellid", "string", "Physical Cell ID");
    this.AddParam("frequencyband", "string", "Frequency Band of active set");
    this.AddParam("earfcn", "string", "E-UTRA absolute radio frequency channel number for searching");
    this.AddParam("dlbw", "string", "Transmission bandwidth configuration of the serving cell on the downlink");
    this.AddParam("ulbw", "string", "Transmission bandwidth configuration of the serving cell on the uplink");
    this.AddParam("rsrp", "string", "Current reference signal power");
    this.AddParam("rsrq", "string", "Current reference signal receive quality");
    this.AddParam("rssi", "string", " Current Received signal strength indicator");
    this.AddParam("rssnr", "string", "Average reference signal signal-to-noise ratio");
    
    // If GSM
    this.AddParam("lac", "string", "Local Area Code");
    this.AddParam("cellid", "string", "Cell ID");
    this.AddParam("absoluterfchnum", "string", "AFRCN for service cell");
    this.AddParam("trackloadjust", "string", "Track LO Adjust");
    this.AddParam("c1", "string", "Coefficient for base station selection");
    this.AddParam("c2", "string", "Coefficient for Cell re-selection");
    
    this.AddReadAnswerParam({systemmode:"gsm", operationmode:null, lac:null, cellid:null, absoluterfchnum:null, trackloadjust:null, c1:null, c2:null});
    this.AddReadAnswerParam({systemmode:null, operationmode:null, mccmnc:null, tac:null, scellid:null, pcellid:null, frequencyband:null, earfcn:null, dlbw:null, ulbw:null, rsrp:null, rsrq:null, rssi:null, rssnr:null});
  }
    
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "read")
    {
      Object.keys(value).forEach(k=>{
        _CN("span", {}, [k + ": " + value[k]], div);
      });
    }
  }
};
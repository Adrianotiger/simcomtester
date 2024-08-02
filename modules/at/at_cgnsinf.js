let AT_CGNSINF = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "GNSS Navigation Information Parsed From NMEA",
      example: "+CGNSINF:1,,,0.000000,0.000000,-18.000,,,1,,0.1,0.1,0.1,,,,9999000.0,6144.0",
      cmd: "AT+CGNSINF",
      doc: "8.2.2"
    });
    
    let enumR = [];
    enumR.push(new ATEnum(0, "GNSS off"));
    enumR.push(new ATEnum(1, "GNSS on"));
    
    let enumF = [];
    enumF.push(new ATEnum(0, "Not fixed position"));
    enumF.push(new ATEnum(1, "Fixed position"));

    let enumM = [];
    enumM.push(new ATEnum(0, "None"));
    enumM.push(new ATEnum(1, "Standard"));
    enumM.push(new ATEnum(2, "Differential"));
    
    this.AddParam("runstatus", enumR, "GNSS run status");
    this.AddParam("fixstatus", enumF, "Fix status");
    this.AddParam("datetime", "string", "date and time yyyyMMddhhmmss.sss");
    this.AddParam("latitude", "number", "Latitude -90.000000-90.000000");
    this.AddParam("longitude", "number", "Longitude -180.000000-180.000000");
    this.AddParam("altitude", "number", "MSL altitude (meters)");
    this.AddParam("speed", "number", "Speed over ground (km/h)");
    this.AddParam("course", "number", "Course over ground (degree)");
    this.AddParam("fixmode", enumM, "Fix Mode");
    this.AddParam("reserved1", "string", "Reserved (1)");
    this.AddParam("hdop", "number", "HDOP - Horizontal Dilution of Precision");
    this.AddParam("pdop", "number", "PDOP - Position Dilution of Precision");
    this.AddParam("vdop", "number", "VDOP - Vertical Dilution of Precision");
    this.AddParam("reserved2", "string", "Reserved (2)");
    this.AddParam("satellites", "number", "GPS Satellites in View");
    this.AddParam("reserved3", "string", "Reserved (3)");
    this.AddParam("hpa", "number", "HPA - Horizontal Position Accuracy (meters)");
    this.AddParam("vpa", "number", "VPA - Vertical Position Accuracy (meters)");
        
    this.AddExeAnswerParam({runstatus:null, fixstatus:null, datetime:null, latitude:null, longitude:null, altitude:null, speed:null, course:null, fixmode:null, reserved1:null,
                            hdop:null, pdop:null, vdop:null, reserved2:null, satellites:null, reserved3:null, hpa:null, vpa:null});
  }
    
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "exe")
    {
      Object.keys(value).forEach(k=>{
        _CN("span", {}, [k + ": " + value[k]], div);
      });
    }
  }

  GetLatitude()
  {
    const value = this.GetValue();
    return value.latitude;
  }

  GetLongitude()
  {
    const value = this.GetValue();
    return value.longitude;
  }

  GetAccuracy()
  {
    const value = this.GetValue();
    return Math.max(parseFloat(value.hpa), parseFloat(value.vpa));
  }
};
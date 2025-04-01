let AT_CLTS = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Get Local Timestamp",
      example: "+CLTS: 0",
      cmd: "AT+CLTS",
      doc: "5.2.4"
    });
    
    let enumMode = [];
    enumMode.push(new ATEnum(0, "disable"));
    enumMode.push(new ATEnum(1, "enable"));
    this.AddParam("mode", enumMode, "mode");
    
    this.AddReadAnswerParam({mode:null});
    this.AddWriteSendParam({mode:null});
  }
    
};

let _PSUTTZ = new class extends ATBase
{
  constructor()
  {
    super({
      description: "Time Report (see AT+CLTS)",
      example: "*PSUTTZ: 2025,04,01,15,12,10,\"\",1",
      cmd: "*PSUTTZ",
      doc: "5.2.49"
    });

    this.AddParam("year", "integer", "year");
    this.AddParam("month", "integer", "month");
    this.AddParam("day", "integer", "day");
    this.AddParam("hour", "integer", "hour");
    this.AddParam("min", "integer", "min");
    this.AddParam("sec", "integer", "sec");
    this.AddParam("time_zone", "string", "time zone");
    this.AddParam("dst", "integer", "daylight saving");

    this.AddUnsolicitedAnswerParam({year:null, month:null, day:null, hour:null, min:null, sec:null, time_zone:null, dst:null});
  }
};

let _CTZV = new class extends ATBase
{
  constructor()
  {
    super({
      description: "Time Zone Report (see AT+CLTS)",
      example: "+CTZV: \"1\"",
      cmd: "+CTZV",
      doc: "5.2.49"
    });

    this.AddParam("time_zone", "string", "time zone");

    this.AddUnsolicitedAnswerParam({time_zone:null});
  }
};


let _DST = new class extends ATBase
{
  constructor()
  {
    super({
      description: "Time Daylight Saving Report (see AT+CLTS)",
      example: "+DST: \"1\"",
      cmd: "+DST",
      doc: "5.2.49"
    });

    this.AddParam("dst", "integer", "daylight saving time");

    this.AddUnsolicitedAnswerParam({dst:null});
  }
};



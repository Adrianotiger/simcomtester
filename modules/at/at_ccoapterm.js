let AT_CCOAPTERM = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true, 
      description: "Delete CoAP Object",
      cmd: "AT+CCOAPTERM"
    });//false, false, true, false, "Delete CoAP Object", "", "AT+CCOAPTERM", 1000);
  }
};
let AT_CCID = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Integrated Circuit Card Identifier",
      example: "89861118231006965031",
      cmd: "AT+CCID",
      timeout: 2000
    });//false, false, true, true, "Integrated Circuit Card Identifier", "89861118231006965031", "AT+CCID", 2000);
  }
  
};
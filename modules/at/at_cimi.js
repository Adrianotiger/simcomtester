let AT_CIMI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request International Mobile Subscriber Identity",
      example: "460113007570785",
      cmd: "AT+CIMI",
      doc: "3.2.6"
    });//false, false, true, true, "Request International Mobile Subscriber Identity", "460113007570785", "AT+CIMI", 1000);
  }
};
let AT_CFSINIT = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Get Flash Data Buffer",
      cmd: "AT+CFSINIT",
      doc: "9.2.1"
    }); //false, false, true, false, "Get Flash Data Buffer", "", "AT+CFSINIT", 1000);
  }
};
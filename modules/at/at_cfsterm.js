let AT_CFSTERM = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Free the Flash Buffer Allocated by CFSINIT",
      cmd: "AT+CFSTERM",
      doc: "9.2.8"
    }); //false, false, true, false, "Free the Flash Buffer Allocated by CFSINIT", "", "AT+CFSTERM", 1000);
  }
};
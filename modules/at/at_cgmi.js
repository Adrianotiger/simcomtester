let AT_CGMI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request Manufacturer Identification (GMI)",
      example: "SIMCOM_Ltd",
      cmd: "AT+CGMI",
      doc: "3.2.1"
    });
  }
};
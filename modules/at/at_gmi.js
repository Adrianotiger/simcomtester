let AT_GMI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request Manufacturer Identification",
      example: "SIMCOM_Ltd",
      cmd: "AT+GMI"
    });
  }
};
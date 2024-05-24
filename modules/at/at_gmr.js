let AT_GMR = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request TA Revision Identification of Software Release",
      example: "Revision:1351B05SIM7080G",
      cmd: "AT+GMR"
    });
  }
};
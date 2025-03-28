let AT_CGMM = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request Model Identification (GMM)",
      example: "SIMCOM_SIM7080G",
      cmd: "AT+CGMM",
      doc: "3.2.2"
    });
  }
};
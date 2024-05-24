let AT_GMM = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request Model Identification",
      example: "SIMCOM_SIM7080G",
      cmd: "AT+GMM"
    });
  }
};
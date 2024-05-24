let AT_GOI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Global Object Identification",
      example: "SIM7080",
      cmd: "AT+GOI"
    });
  }
};
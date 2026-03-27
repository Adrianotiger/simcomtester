let AT_SIMCOMATI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Display SimCom Firmware Information",
      example: "Revision:1951B17SIM7080",
      cmd: "AT+SIMCOMATI",
      doc: "98.0"
    });
  }
};
let AT_CREBOOT = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Reboot Module",
      cmd: "AT+CREBOOT",
      doc: "5.2.46"
    }); //false, false, true, true, "Reboot Module", "", "AT+CREBOOT", 1000);
  }
};
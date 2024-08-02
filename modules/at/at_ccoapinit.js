let AT_CCOAPINIT = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Create CoAP Object",
      cmd: "AT+CCOAPINIT",
      doc: "18.2.2"
    }); //false, false, true, true, "Create CoAP Object", "", "AT+CCOAPINIT", 1000);
  }
};
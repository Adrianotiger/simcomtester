let AT_GSN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request Product Serial Number Identification",
      example: "869951030006302",
      cmd: "AT+GSN",
      doc: "2.2.29"
    });//false, false, true, true, "Request Product Serial Number Identification", "869951030006302", "AT+GSN", 1000);
  }
};
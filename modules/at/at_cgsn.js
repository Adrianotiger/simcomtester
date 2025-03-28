let AT_CGSN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Request Product Serial Number Identification (GSN)",
      example: "869951030006302",
      cmd: "AT+CGSN",
      doc: "3.2.4"
    });
  }
  
};
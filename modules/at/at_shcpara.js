let AT_SHCPARA = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "HTTP(S) Clear Parameters",
      cmd: "AT+SHCPARA",
      doc: "13.2.7"
    });
  }
};
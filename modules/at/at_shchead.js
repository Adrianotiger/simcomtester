let AT_SHCHEAD = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "HTTP(S) Clear Head",
      cmd: "AT+SHCHEAD",
      doc: "13.2.9"
    });
  }
};
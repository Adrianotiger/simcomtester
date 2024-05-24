let AT_SHDISC = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Disconnect HTTP(S)",
      cmd: "AT+SHDISC"
    });
  }
};
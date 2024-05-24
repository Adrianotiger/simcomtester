let AT_SHCONN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "HTTP(S) Connection",
      cmd: "AT+SHCONN"
    });
  }
};
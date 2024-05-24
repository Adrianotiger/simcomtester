let ATE1 = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Set echo on",
      cmd: "ATE1"
    });
  }
};
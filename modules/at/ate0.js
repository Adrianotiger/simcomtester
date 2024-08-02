let ATE0 = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Set echo off",
      cmd: "ATE0",
      doc: "2.2.3"
    });//false, false, true, false, "Set Echo Off", "", "ATE0", 1000);
  }
};
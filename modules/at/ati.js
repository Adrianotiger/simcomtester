let ATI = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      description: "Display Product Identification Information",
      example: "R1951.01",
      cmd: "ATI",
      doc: "2.2.5"
    });
  }
};
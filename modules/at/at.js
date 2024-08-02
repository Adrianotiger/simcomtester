let AT = new class extends ATBase
{
  constructor()
  {    
    super({
      exe: true,
      description: "Echo Test Command",
      example: "+AT",
      cmd: "AT",
      doc: "2.2.1"
    });
  }
};
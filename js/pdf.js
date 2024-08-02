let PDFManual = new class
{
  #div = null;
  #canvas = null;
  #menu = null;
  #chapters = [];

  #pdf = null;
  #currentPage = 1;

  pdfFile = null;

  constructor()
  {
    _CN("script", {src:'//mozilla.github.io/pdf.js/build/pdf.mjs', type:'module', async:true}, [], document.head);

    let ipdf = setInterval(()=>{
      if(pdfjsLib && pdfjsLib.GlobalWorkerOptions)
      {
        clearInterval(ipdf);
        pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.mjs";
      }
    }, 1000);

    this.#canvas = _CN("canvas", {width:840, height:1188});
    this.#menu = _CN("div");
    this.#div = _CN("div", {class:'pdfviewer', style:"display:none"}, [this.#canvas, this.#menu], document.body);

    setTimeout(()=>{
        this.#createMenu();
    }, 500);
  }

  LoadPDF(pdf)
  {
    this.pdfFile = pdf;
    let pdft = pdfjsLib.getDocument(pdf);
    
    pdft.promise.then(async(pdf)=>{
      this.#pdf = pdf;

      pdf.getOutline().then(outline=>{
        console.log(outline);
        this.#LoadChapters(outline);
        console.log(this.#chapters);
// 1.4.4 = '[{"num":898,"gen:0},{"name":"XYZ"},85.6,672.2,0]'
      });
    });
  }

  OpenChapter(ch)
  {
    this.#div.style.display = "block";

    this.#pdf.getPageIndex(ch.dest[0]).then(async (searchpage)=>{
      console.log("FOUND DESTINATION!", ch, searchpage);

      this.#currentPage = parseInt(searchpage) + 1;

      this.#DrawPage();
    });
  }

  GetChapterPage(ch, f)
  {
    this.#pdf.getPageIndex(ch.dest[0]).then(sp=>{
      f(sp);
    });
  }

  async #DrawPage()
  {
    let pdfpage = await this.#pdf.getPage(this.#currentPage);

    const viewport = pdfpage.getViewport({scale: 2});
    const context = this.#canvas.getContext('2d');

    this.#canvas.width = viewport.width;
    this.#canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await pdfpage.render(renderContext);
    this.#canvas.style.display = "block";
  }

  GetChapter(ch)
  {
    let ret = null;
    this.#chapters.forEach(c=>{
      if(c.c == ch) ret = c;
    });
    return ret;
  }

  #LoadChapters(outline)
  {
    for(let j=0;j<outline.length;j++)
    {
      if(outline[j].title.search(/^\d+[\.]?\d*[\.]?\d*/) === 0)
      {
        const m = /^\d+[\.]?\d*[\.]?\d*/.exec(outline[j].title);
        const str = m[0];
        this.#chapters.push({
            c: str,
            dest: outline[j].dest,
            title: outline[j].title.substring(str.length)
        });
      }
      this.#LoadChapters(outline[j].items);
    }
  }

  #createMenu()
  {
    let close = _CN("span", {}, ["𝘅"], this.#menu);
    let next = _CN("span", {}, ["˃"], this.#menu);
    let prev = _CN("span", {}, ["˂"], this.#menu);

    close.addEventListener("click", ()=>{
      this.#div.style.display = "none";
      this.#canvas.style.display = "none";
    });

    next.addEventListener("click", ()=>{
      this.#currentPage++;
      this.#DrawPage();
    });

    prev.addEventListener("click", ()=>{
      if(this.#currentPage > 1)
      {
        this.#currentPage--;
        this.#DrawPage();
      }
    });
  }
};
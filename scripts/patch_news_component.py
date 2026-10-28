with open('src/app/jesus/news/news.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace getnews() implementation with spinner-aware version
old_getnews = """  getnews() {
    this.service.getupdatenews().subscribe(res => {
      console.log(res.data);
      if (res.status == 202) {
        Swal.fire(res.message);
      } else if (res.status == 200) {
        this.searchnews = res.data;
        console.log(res.data);
      }
    }, error => {

    })

  }"""

new_getnews = """  getnews() {
    this.showSpinner = true;
    this.service.getupdatenews().subscribe({
      next: (res: any) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.searchnews = res.data;
        }
      },
      error: (err: any) => {
        console.error('Error loading news:', err);
        this.showSpinner = false;
      },
      complete: () => {
        this.showSpinner = false;
      }
    });
  }"""

# Also ensure ngOnInit starts with showSpinner = true
old_ngoninit = """  ngOnInit(): void {
    this.getnews();
    this.getadds();
  }"""

new_ngoninit = """  ngOnInit(): void {
    this.showSpinner = true;
    this.getnews();
    this.getadds();
  }"""

if old_getnews in text:
    text = text.replace(old_getnews, new_getnews)
    print("Replaced getnews")
else:
    # try normalized
    old_getnews_crlf = old_getnews.replace('\n', '\r\n')
    if old_getnews_crlf in text:
        text = text.replace(old_getnews_crlf, new_getnews.replace('\n', '\r\n'))
        print("Replaced getnews CRLF")
    else:
        print("Could not find old getnews")

if old_ngoninit in text:
    text = text.replace(old_ngoninit, new_ngoninit)
    print("Replaced ngOnInit")
else:
    old_ngoninit_crlf = old_ngoninit.replace('\n', '\r\n')
    if old_ngoninit_crlf in text:
        text = text.replace(old_ngoninit_crlf, new_ngoninit.replace('\n', '\r\n'))
        print("Replaced ngOnInit CRLF")
    else:
        print("Could not find old ngOnInit")

with open('src/app/jesus/news/news.component.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated news.component.ts")


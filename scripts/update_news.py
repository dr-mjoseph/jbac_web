with open('src/app/jesus/news/news.component.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

# Add fields and methods if not present
if 'showFilters' not in ts:
    new_fields = '''export class NewsComponent {
  showSpinner: boolean = false;
  showFilters: boolean = false;
  showDateFilter: boolean = false;
  showCategoryFilter: boolean = false;
  filterDate: string = '';
  filterCategory: string = '';
  allnewsData: any[] = [];
  categories: string[] = [
    'క్రైస్తవుల మీద దాడులు',
    'గౌరవ వేతనం, ప్రభుత్వ పథకాలు సంబంధించిన న్యూస్',
    'క్రైస్తవులకు సంబంధించిన న్యూస్',
    'జనరల్ న్యూస్',
    'దళిత్ క్రిస్టియన్స్ షెడ్యూల్ కాస్ట్ స్టేటస్ న్యూస్',
    'చదువుకి సంబంధించి',
    'ట్రైనింగ్ కి సంబంధించి',
    'ఉద్యోగాలకు సంబంధించి',
    'ఆరోగ్యం కి సంబంధించి',
    'సమాజం లోని సమస్యలు కి సంబంధించి న్యూస్',
    'డా|| జోసెఫ్ గారి వార్తలు'
  ];

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (this.showFilters && !this.showDateFilter && !this.showCategoryFilter) {
      this.showDateFilter = true;
      this.showCategoryFilter = true;
    }
  }

  toggleDateFilter() {
    this.showDateFilter = !this.showDateFilter;
  }

  toggleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;
  }

  applyNewsFilters() {
    let filtered = [...this.allnewsData];
    if (this.filterDate) {
      filtered = filtered.filter(item => {
        if (!item.cts) return false;
        return item.cts.toString().startsWith(this.filterDate);
      });
    }
    if (this.filterCategory) {
      filtered = filtered.filter(item => {
        return item.news && item.news.toString().trim().toLowerCase().includes(this.filterCategory.trim().toLowerCase());
      });
    }
    this.searchnews = filtered;
    this.page = 1;
  }

  resetNewsFilters() {
    this.filterDate = '';
    this.filterCategory = '';
    this.searchnews = [...this.allnewsData];
    this.page = 1;
  }
'''
    ts = ts.replace('export class NewsComponent {\n  showSpinner: boolean = false;', new_fields)

# Update getnews()
old_getnews = '''  getnews() {
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
  }'''

new_getnews = '''  getnews() {
    this.showSpinner = true;
    this.service.getupdatenews().subscribe({
      next: (res: any) => {
        if (res.status == 202) {
          Swal.fire(res.message);
        } else if (res.status == 200) {
          this.allnewsData = res.data || [];
          this.applyNewsFilters();
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
  }'''

ts = ts.replace(old_getnews, new_getnews)

with open('src/app/jesus/news/news.component.ts', 'w', encoding='utf-8') as f:
    f.write(ts)
print("Updated news.component.ts")

# Update news.component.html
with open('src/app/jesus/news/news.component.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_sec = '''    <section class="gradient-custom">
        <div class="container py-4">
            <div class="row g-4">
                <div class="col-lg-8">'''

new_sec = '''    <section class="gradient-custom">
        <div class="container py-4">
            <!-- News Section Header with Filter Search Toggle -->
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h3 class="m-0"><b>తాజా వార్తలు / Latest News</b></h3>
                <button type="button" class="default-btn user-all-btn events-filter-toggle"
                    (click)="toggleFilters()" [attr.aria-expanded]="showFilters">
                    <i class="fa fa-filter me-1"></i> ఫిల్టర్ సెర్చ్ (Filter Search)
                </button>
            </div>

            <!-- Filter Panel with 2 expandable fields: Date and News Category -->
            <div class="card p-3 shadow-sm border-0 filter-card mb-4" *ngIf="showFilters">
                <div class="d-flex gap-2 flex-wrap mb-3 align-items-center">
                    <button type="button" class="btn btn-sm"
                        [ngClass]="showDateFilter ? 'btn-primary' : 'btn-outline-primary'"
                        (click)="toggleDateFilter()">
                        <i class="fa fa-calendar me-1"></i> తేదీ / Date 
                        <i class="fa ms-1" [ngClass]="showDateFilter ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </button>

                    <button type="button" class="btn btn-sm"
                        [ngClass]="showCategoryFilter ? 'btn-success' : 'btn-outline-success'"
                        (click)="toggleCategoryFilter()">
                        <i class="fa fa-tags me-1"></i> న్యూస్ కేటగిరీ / Category 
                        <i class="fa ms-1" [ngClass]="showCategoryFilter ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </button>

                    <button type="button" class="btn btn-sm btn-outline-secondary ms-auto"
                        (click)="resetNewsFilters()">
                        <i class="fa fa-refresh me-1"></i> రీసెట్ / Reset
                    </button>
                </div>

                <div class="row g-3">
                    <!-- Date Field (expanded on click) -->
                    <div class="col-md-6" *ngIf="showDateFilter">
                        <label class="form-label fw-bold">తేదీ ఎంచుకోండి (Select Date)</label>
                        <input type="date" class="form-control" [(ngModel)]="filterDate" (change)="applyNewsFilters()">
                    </div>

                    <!-- News Category Field (expanded on click) -->
                    <div class="col-md-6" *ngIf="showCategoryFilter">
                        <label class="form-label fw-bold">న్యూస్ కేటగిరీ ఎంచుకోండి (Select News Category)</label>
                        <select class="form-control form-select" [(ngModel)]="filterCategory" (change)="applyNewsFilters()">
                            <option value="">అన్ని కేటగిరీలు (All Categories)</option>
                            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-lg-8">'''

if old_sec in html:
    html = html.replace(old_sec, new_sec, 1)

if 'my-overlay' not in html:
    html += '''
<!-- Spinner Overlay -->
<div class="my-overlay" *ngIf="showSpinner">
    <div class="cusloader"></div>
    <p class="text-white mt-2 font-weight-bold">డేటా లోడ్ అవుతోంది... దయచేసి వేచి ఉండండి</p>
</div>
'''

with open('src/app/jesus/news/news.component.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated news.component.html")

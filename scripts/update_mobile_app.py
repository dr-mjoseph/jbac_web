import os
import re

app_dir = r"C:\Users\rajes\StudioProjects\jbac_app"

def update_config_and_pkg():
    config_path = os.path.join(app_dir, "config.xml")
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = f.read()
    
    cfg = re.sub(r'android-versionCode="\d+"', 'android-versionCode="47"', cfg)
    cfg = re.sub(r'version="[\d\.]+"', 'version="0.0.47"', cfg)
    
    # Ensure targetSdkVersion is 36 or above
    if '<preference name="android-targetSdkVersion" value="36" />' not in cfg:
        cfg = re.sub(r'<preference name="android-targetSdkVersion" value="\d+" />', '<preference name="android-targetSdkVersion" value="36" />', cfg)

    with open(config_path, "w", encoding="utf-8") as f:
        f.write(cfg)
    print("Updated config.xml with versionCode 47, version 0.0.47, targetSdkVersion 36")

    pkg_path = os.path.join(app_dir, "package.json")
    with open(pkg_path, "r", encoding="utf-8") as f:
        pkg = f.read()
    pkg = re.sub(r'"version": "[\d\.]+"', '"version": "0.0.47"', pkg)
    with open(pkg_path, "w", encoding="utf-8") as f:
        f.write(pkg)
    print("Updated package.json to 0.0.47")

def update_wingcommand():
    wc_path = os.path.join(app_dir, "src", "pages", "wingcommand", "wingcommand.ts")
    with open(wc_path, "r", encoding="utf-8") as f:
        code = f.read()
    
    # Ensure LoadingController import
    if "LoadingController" not in code:
        code = code.replace("AlertController, IonicPage, NavController", "AlertController, IonicPage, LoadingController, NavController")
    
    # Constructor injection
    if "loadingCtrl: LoadingController" not in code:
        code = code.replace("public alertCtrl: AlertController) {", "public alertCtrl: AlertController, public loadingCtrl: LoadingController) {")
    
    # Add loader in fetchSubordinateRequests
    old_fetch_start = "    if (u.leadertype == 1) {\n      if (u.generaltype == 0) {"
    new_fetch_start = """    let loader = this.loadingCtrl.create({
      content: 'డేటా లోడ్ అవుతోంది... (Loading data...)'
    });
    loader.present().catch(() => {});

    if (u.leadertype == 1) {
      if (u.generaltype == 0) {"""
    
    if "let loader = this.loadingCtrl.create" not in code:
        code = code.replace(old_fetch_start, new_fetch_start)
        
        # Dismiss loader in subscribe
        code = code.replace("this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {",
                            "this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {\n        loader.dismiss().catch(() => {});", 1)
        code = code.replace("this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {",
                            "this.service.getLeaderswebsitewing(data4).subscribe((result: any) => {\n        loader.dismiss().catch(() => {});", 1)

    with open(wc_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated wingcommand.ts with LoadingController")

def update_jobs():
    jobs_path = os.path.join(app_dir, "src", "pages", "jobs", "jobs.ts")
    with open(jobs_path, "r", encoding="utf-8") as f:
        code = f.read()

    if "LoadingController" not in code:
        code = code.replace("IonicPage, NavController", "IonicPage, LoadingController, NavController")
    if "loadingCtrl: LoadingController" not in code:
        code = code.replace("private service: ServiceProvider) {", "private service: ServiceProvider, public loadingCtrl: LoadingController) {")
    
    # Wrap search()
    old_search = "  search() {\n    this.service.getjobs(this.form.value).subscribe((res: any) => {"
    new_search = """  search() {
    let loader = this.loadingCtrl.create({ content: 'ఉద్యోగాల సమాచారం లోడ్ అవుతోంది...' });
    loader.present().catch(() => {});
    this.service.getjobs(this.form.value).subscribe((res: any) => {
      loader.dismiss().catch(() => {});"""
    if "ఉద్యోగాల సమాచారం లోడ్ అవుతోంది..." not in code:
        code = code.replace(old_search, new_search)

    with open(jobs_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated mobile jobs.ts with LoadingController")

def update_marriage():
    m_path = os.path.join(app_dir, "src", "pages", "marriage", "marriage.ts")
    with open(m_path, "r", encoding="utf-8") as f:
        code = f.read()

    if "LoadingController" not in code:
        code = code.replace("IonicPage, NavController", "IonicPage, LoadingController, NavController")
    if "loadingCtrl: LoadingController" not in code:
        code = code.replace("public service: ServiceProvider) {", "public service: ServiceProvider, public loadingCtrl: LoadingController) {")

    old_search = "  search() {\n    this.service.searchmarriages(this.form.value).subscribe((res: any) => {"
    new_search = """  search() {
    let loader = this.loadingCtrl.create({ content: 'వివాహ సంబంధాల సమాచారం లోడ్ అవుతోంది...' });
    loader.present().catch(() => {});
    this.service.searchmarriages(this.form.value).subscribe((res: any) => {
      loader.dismiss().catch(() => {});"""
    if "వివాహ సంబంధాల సమాచారం లోడ్ అవుతోంది..." not in code:
        code = code.replace(old_search, new_search)

    with open(m_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated mobile marriage.ts with LoadingController")

def update_institute():
    inst_path = os.path.join(app_dir, "src", "pages", "institute", "institute.ts")
    with open(inst_path, "r", encoding="utf-8") as f:
        code = f.read()

    if "LoadingController" not in code:
        code = code.replace("IonicPage, NavController", "IonicPage, LoadingController, NavController")
    if "loadingCtrl: LoadingController" not in code:
        code = code.replace("constructor(public navCtrl: NavController,", "constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,")

    old_search = "  search() {\n    this.service.Searchinstitute(this.form.value).subscribe((res: any) => {"
    new_search = """  search() {
    let loader = this.loadingCtrl.create({ content: 'ఇన్స్టిట్యూట్ సమాచారం లోడ్ అవుతోంది...' });
    loader.present().catch(() => {});
    this.service.Searchinstitute(this.form.value).subscribe((res: any) => {
      loader.dismiss().catch(() => {});"""
    if "ఇన్స్టిట్యూట్ సమాచారం లోడ్ అవుతోంది..." not in code:
        code = code.replace(old_search, new_search)

    with open(inst_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated mobile institute.ts with LoadingController")

update_config_and_pkg()
update_wingcommand()
update_jobs()
update_marriage()
update_institute()
print("Mobile app updates applied successfully!")

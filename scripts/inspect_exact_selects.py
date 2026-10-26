import os, re

components = [
    # Group 1 (Issue 4):
    ("believerregister", "beliverform", "state_id", "districts", "constituencyname", "mandals", "panchayati"),
    ("addattacks", "attacksform", "state_id", "district_id", "constituency_id", "mandal_id", "village_id"),
    ("studentregister", "studentform", "state_id", "district_id", "constituency_id", "mandal_id", "village_id"),
    ("studentregister_res", "studentform", "res_state_id", "resdistricts", "resconstituencyname", "resmandals", "respanchayati"),
    ("ministryregister", "ministryform", "state_id", "district_id", "constituency_id", "mandal_id", "panchayat_id"),
    ("pastorregister", "pastorform", "state_id", "district_id", "constituency_id", "mandal_id", "panchayat_id"),
    ("churchregister", "churchregsiterform", "state_id", "district_id", "constituency_id", "mandal_id", "village_id"),
    ("organisationregister", "independentorgainsationform", "state_id", "districts", "constituencyname", "mandals", "panchayati"),
    ("pastorassociationregister", "pastorsassociations", "state_id", "district_id", "constituency_id", "mandal_id", "village_id"),

    # Group 2 (Issue 7):
    ("institute", "serachMeetingform", "state_id", "district_id", "constenncy_id", "mandal_id", "panchayati_id"),
    ("marriages", "serachMeetingform", "state_id", "district_id", "constenncy_id", "mandal_id", "panchayati_id"),
    ("jobs", "serachMeetingform", "state_id", "district_id", "constenncy_id", "mandal_id", "panchayati_id"),
    ("business", "serachMeetingform", "state_id", "district_id", "constenncy_id", "mandal_id", "panchayati_id"),
    ("organization", "serachMeetingform", "state_id", "district_id", "constenncy_id", "mandal_id", "panchayati_id"),

    # Group 3 (Issue 9):
    ("addchurchtimings", "addingchurchtimimngs", "state_id", "district_id", "constituency_id", "mandal_id", "church"),
    ("addinstitute", "addinginsututies", "state_id", "district_id", "constituency_id", "mandal_id", "village_id"),
    ("addbusiness", "addingbusiness", "state_id", "districtname", "constituencyname", "mandals", "village_name"),
    ("addmarriages", "addingmarriages", "state_id", "districtname", "constituencyname", "mandals", "village_name"),
    ("addjobs", "jobsadding", "state_id", "districtname", "constituencyname", "mandals", "village_name"),
]

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for item in components:
    comp_name = item[0].replace("_res", "")
    fg_name = item[1]
    ctrls = item[2:]
    html_path = os.path.join(base, comp_name, f"{comp_name}.component.html")
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    print(f"=== {item[0]} ({fg_name}) ===")
    for c in ctrls:
        pattern = rf'<select[^>]*formControlName=["\']{c}["\'][^>]*>'
        m = re.search(pattern, html)
        if m:
            print(f"  FOUND {c}: {m.group(0)[:90]}")
        else:
            print(f"  MISSING {c} in {comp_name}!")

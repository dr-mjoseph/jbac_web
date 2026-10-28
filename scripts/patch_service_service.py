with open('src/app/jesus/service.service.ts', 'r', encoding='utf-8') as f:
    text = f.read()

old_getadds = """  getadds() {
    var data = {}
    return this.http.post<any>(this.testApi + `getaddsdata`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }"""

new_getadds = """  getadds() {
    var data = {}
    return this.http.post<any>(this.testApi + `getaddsdata`, data).pipe(map(res => {
      if (res && res.data && Array.isArray(res.data)) {
        const todayStr = new Date().toISOString().substring(0, 10);
        res.data = res.data.filter((ad: any) => {
          // If stopped by admin
          if (ad.d_in && ad.d_in != 0 && ad.d_in != '0') return false;

          const typeStr = String(ad.type || '').toLowerCase();
          const isMeeting = typeStr.includes('meet');

          // If not a meeting, display continuously until stopped by admin
          if (!isMeeting) return true;

          // If meeting, display until end date after that it disappears
          const endStr = ad.enddate || ad.todate;
          if (endStr) {
            return String(endStr).substring(0, 10) >= todayStr;
          }
          return true;
        });
      }
      return res;
    }, (error: any) => {
      return error;
    }));
  }

  lookupExistingUser(phone: string) {
    return this.http.post<any>(this.testApi + 'lookup-existing-user', { phone });
  }"""

if old_getadds in text:
    text = text.replace(old_getadds, new_getadds)
    print("Replaced getadds")
else:
    old_getadds_crlf = old_getadds.replace('\n', '\r\n')
    if old_getadds_crlf in text:
        text = text.replace(old_getadds_crlf, new_getadds.replace('\n', '\r\n'))
        print("Replaced getadds CRLF")
    else:
        print("Could not find old getadds")

with open('src/app/jesus/service.service.ts', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated service.service.ts")


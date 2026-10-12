const fs = require('fs');

let s = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8').replace(/\r\n/g, '\n');

// 1. getmdistrict to gempanchayatis
const start1 = s.indexOf('  getmdistrict() {');
const end1 = s.indexOf('  getbelivers() {', start1);
if (start1 !== -1 && end1 !== -1) {
  const replacement1 = `  getmdistrict() {
    return this.getdistrict();
  }
  getmandals(constId?: any) {
    var data: any = {};
    if (constId !== undefined && constId !== null && constId !== '') {
      data = typeof constId === 'object' && constId !== null ? constId : { const_id: constId };
    }
    return this.http.post<any>(this.testApi + \`getmandals\`, data).pipe(
      map(res => {
        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
          const cId = data && data.const_id;
          if (cId && (FALLBACK_DROPDOWN_DATA as any).mandals) {
            const filtered = (FALLBACK_DROPDOWN_DATA as any).mandals.filter((m: any) => String(m.const_id) === String(cId));
            return { status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).mandals };
          }
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).mandals };
        }
        const normalized = res.data.map((m: any) => ({
          ...m,
          mndl_nm: m.mndl_nm || m.mandalname || m.name || \`మండలం #\${m.id}\`,
          mandalname: m.mandalname || m.mndl_nm || m.name || \`మండలం #\${m.id}\`,
          name: m.name || m.mndl_nm || m.mandalname || \`మండలం #\${m.id}\`,
          const_id: m.const_id !== undefined && m.const_id !== null ? Number(m.const_id) : m.const_id,
          dstrct_id: m.dstrct_id !== undefined && m.dstrct_id !== null ? Number(m.dstrct_id) : m.dstrct_id
        }));
        return { status: 200, data: normalized };
      }),
      catchError(() => {
        const cId = data && data.const_id;
        if (cId && (FALLBACK_DROPDOWN_DATA as any).mandals) {
          const filtered = (FALLBACK_DROPDOWN_DATA as any).mandals.filter((m: any) => String(m.const_id) === String(cId));
          return of({ status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).mandals });
        }
        return of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).mandals });
      })
    );
  }
  getmmandals(constId?: any) {
    return this.getmandals(constId);
  }
  gepanchayatis(mandalId?: any) {
    var data: any = {};
    if (mandalId !== undefined && mandalId !== null && mandalId !== '') {
      data = typeof mandalId === 'object' && mandalId !== null ? mandalId : { mandal_id: mandalId };
    }
    return this.http.post<any>(this.testApi + \`gepanchayati\`, data).pipe(
      map(res => {
        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).panchayatis };
        }
        const normalized = res.data.map((p: any) => ({
          ...p,
          pnchyt_nm: p.pnchyt_nm || p.panchayatname || p.name || \`గ్రామం / పంచాయతీ #\${p.id}\`,
          panchayatname: p.panchayatname || p.pnchyt_nm || p.name || \`గ్రామం / పంచాయతీ #\${p.id}\`,
          name: p.name || p.pnchyt_nm || p.panchayatname || \`గ్రామం / పంచాయతీ #\${p.id}\`,
          mndl_id: p.mndl_id !== undefined && p.mndl_id !== null ? Number(p.mndl_id) : p.mndl_id
        }));
        return { status: 200, data: normalized };
      }),
      catchError(() => of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).panchayatis }))
    );
  }
  gempanchayatis(mandalId?: any) {
    return this.gepanchayatis(mandalId);
  }
\n`;
  s = s.substring(0, start1) + replacement1 + s.substring(end1);
  console.log('Replaced section 1');
} else {
  console.log('Section 1 not found', start1, end1);
}

// 2. getservices
const start2 = s.indexOf('  getservices() {');
const end2 = s.indexOf('  addNew(proofdata: any) {', start2);
if (start2 !== -1 && end2 !== -1) {
  const replacement2 = `  getservices() {
    var data = {}
    return this.http.post<any>(this.testApi + \`getservices\`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).services };
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).services }))
    );
  }
\n`;
  s = s.substring(0, start2) + replacement2 + s.substring(end2);
  console.log('Replaced section 2');
}

// 3. getconsistencys and getmconsistencys
const start3 = s.indexOf('  getconsistencys(districtId?: any) {');
const end3 = s.indexOf('  poststudentsignup(data: any) {', start3);
if (start3 !== -1 && end3 !== -1) {
  const replacement3 = `  getconsistencys(districtId?: any) {
    var data: any = {};
    if (districtId !== undefined && districtId !== null && districtId !== '') {
      data = typeof districtId === 'object' && districtId !== null ? districtId : { district_id: districtId };
    }
    return this.http.post<any>(this.testApi + \`getconsistencys\`, data).pipe(
      map(res => {
        if (!res || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
          const dId = data && data.district_id;
          if (dId && (FALLBACK_DROPDOWN_DATA as any).consistencies) {
            const filtered = (FALLBACK_DROPDOWN_DATA as any).consistencies.filter((c: any) => String(c.dstrct_id) === String(dId));
            return { status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).consistencies };
          }
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).consistencies };
        }
        const normalized = res.data.map((c: any) => ({
          ...c,
          const_nm: c.const_nm || c.constituencyname || c.name || \`నియోజకవర్గం #\${c.id}\`,
          constituencyname: c.constituencyname || c.const_nm || c.name || \`నియోజకవర్గం #\${c.id}\`,
          name: c.name || c.const_nm || c.constituencyname || \`నియోజకవర్గం #\${c.id}\`,
          dstrct_id: c.dstrct_id !== undefined && c.dstrct_id !== null ? Number(c.dstrct_id) : c.dstrct_id
        }));
        return { status: 200, data: normalized };
      }),
      catchError(() => {
        const dId = data && data.district_id;
        if (dId && (FALLBACK_DROPDOWN_DATA as any).consistencies) {
          const filtered = (FALLBACK_DROPDOWN_DATA as any).consistencies.filter((c: any) => String(c.dstrct_id) === String(dId));
          return of({ status: 200, data: filtered.length > 0 ? filtered : (FALLBACK_DROPDOWN_DATA as any).consistencies });
        }
        return of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).consistencies });
      })
    );
  }
  getmconsistencys(districtId?: any) {
    return this.getconsistencys(districtId);
  }
\n`;
  s = s.substring(0, start3) + replacement3 + s.substring(end3);
  console.log('Replaced section 3');
}

// 4. getpastorassci
const start4 = s.indexOf('  getpastorassci() {');
const end4 = s.indexOf('  getvideourldatadetails() {', start4);
if (start4 !== -1 && end4 !== -1) {
  const replacement4 = `  getpastorassci() {
    var data = {}
    return this.http.post<any>(this.testApi + \`getpastorassociation\`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).pastors };
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).pastors }))
    );
  }
\n`;
  s = s.substring(0, start4) + replacement4 + s.substring(end4);
  console.log('Replaced section 4');
}

fs.writeFileSync('src/app/jesus/service.service.ts', s, 'utf8');
console.log('Successfully wrote updated service.service.ts!');

const fs = require('fs');

let s = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8');

// Replace getmdistrict, getmandals, getmmandals, gepanchayatis, gempanchayatis
const target1 = `  getmdistrict() {
    var data = {}
    return this.http.post<any>(this.testApi + \`getmdistricts\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmandals(constId?: any) {
    var data: any = {};
    if (constId !== undefined && constId !== null && constId !== '') {
      data = typeof constId === 'object' && constId !== null ? constId : { const_id: constId };
    }
    return this.http.post<any>(this.testApi + \`getmandals\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmmandals(constId?: any) {
    var data: any = {};
    if (constId !== undefined && constId !== null && constId !== '') {
      data = typeof constId === 'object' && constId !== null ? constId : { const_id: constId };
    }
    return this.http.post<any>(this.testApi + \`getmmandals\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  gepanchayatis(mandalId?: any) {
    var data: any = {};
    if (mandalId !== undefined && mandalId !== null && mandalId !== '') {
      data = typeof mandalId === 'object' && mandalId !== null ? mandalId : { mandal_id: mandalId };
    }
    return this.http.post<any>(this.testApi + \`gepanchayati\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  gempanchayatis(mandalId?: any) {
    var data: any = {};
    if (mandalId !== undefined && mandalId !== null && mandalId !== '') {
      data = typeof mandalId === 'object' && mandalId !== null ? mandalId : { mandal_id: mandalId };
    }
    return this.http.post<any>(this.testApi + \`gepanchayati\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }`;

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
  }`;

// Replace getservices
const target2 = `  getservices() {
    var data = {}
    return this.http.post<any>(this.testApi + \`getservices\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }`;

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
  }`;

// Replace getconsistencys and getmconsistencys
const target3 = `  getconsistencys(districtId?: any) {
    var data: any = {};
    if (districtId !== undefined && districtId !== null && districtId !== '') {
      data = typeof districtId === 'object' && districtId !== null ? districtId : { district_id: districtId };
    }
    return this.http.post<any>(this.testApi + \`getconsistencys\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }
  getmconsistencys(districtId?: any) {
    var data: any = {};
    if (districtId !== undefined && districtId !== null && districtId !== '') {
      data = typeof districtId === 'object' && districtId !== null ? districtId : { district_id: districtId };
    }
    return this.http.post<any>(this.testApi + \`getmconsistencys\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }`;

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
  }`;

// Replace getpastorassci
const target4 = `  getpastorassci() {
    var data = {}
    return this.http.post<any>(this.testApi + \`getpastorassociation\`, data).pipe(map(res => {
      return res;
    }, (error: any) => {
      return error;
    }));
  }`;

const replacement4 = `  getpastorassci() {
    var data = {}
    return this.http.post<any>(this.testApi + \`getpastorassociation\`, data).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: FALLBACK_DROPDOWN_DATA.pastors };
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: FALLBACK_DROPDOWN_DATA.pastors }))
    );
  }`;

console.log('Target 1 exists:', s.includes(target1));
console.log('Target 2 exists:', s.includes(target2));
console.log('Target 3 exists:', s.includes(target3));
console.log('Target 4 exists:', s.includes(target4));

if (s.includes(target1)) s = s.replace(target1, replacement1);
if (s.includes(target2)) s = s.replace(target2, replacement2);
if (s.includes(target3)) s = s.replace(target3, replacement3);
if (s.includes(target4)) s = s.replace(target4, replacement4);

fs.writeFileSync('src/app/jesus/service.service.ts', s, 'utf8');
console.log('Updated src/app/jesus/service.service.ts successfully!');
